import { RepositoryService } from "@/app/backend/services/repositories/repository.service";
import { RepositoryVerificationValidator } from "@/app/backend/validator/RepositoryVerificationValidator";
import { StaticMessage } from "@/app/backend/constants/StaticMessages";
import { SaveRepositoryDetails } from "@/app/backend/infrastructure/dtos/SaveRepositoryDetails";
import { DeleteRepositoryDetails } from "@/app/backend/infrastructure/dtos/DeleteRepositoryDetails";
import { v4 as uuidv4 } from "uuid";
import { parseRepoUrl } from "@/app/backend/utils/parseUrl";
import { fetchBaseUrl } from "@/app/backend/utils/fetchBaseUrl";
import { RepositoryVerification } from "../../infrastructure/dtos/RepositoryVerification";

export class RepositoryController {
  private repositoryService: RepositoryService;
  private repositoryVerificationValidator: RepositoryVerificationValidator;

  constructor() {
    this.repositoryService = new RepositoryService();
    this.repositoryVerificationValidator =
      new RepositoryVerificationValidator();
  }

  async findRepositoryDetails(body: RepositoryVerification, repoToken: string) {
    try {
      await this.repositoryVerificationValidator.ValidateRepository(body);

      const { host_url, repo_url } = body;

      const { hostName, orgName, repoName } = parseRepoUrl(repo_url);

      const baseUrl = fetchBaseUrl(hostName, host_url);

      const strategy = this.repositoryService.getStrategy(hostName);
      const response = await strategy.findRepositoryDetails(
        baseUrl,
        orgName,
        repoName,
        repoToken
      );

      return {
        message: StaticMessage.RepositoryVerifiedSuccessfully,
        data: response,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async saveRepositoryDetails(body: SaveRepositoryDetails, repoToken: string) {
    try {
      const { host_url, repo_url } = body;

      const {
        hostName,
        orgName: organization_name,
        repoName: repo_name,
      } = parseRepoUrl(repo_url);

      await this.repositoryVerificationValidator.SaveRepositoryDetails(body);

      await this.repositoryService.fetchRepoDetailsByName(
        organization_name,
        repo_name
      );

      const baseUrl = fetchBaseUrl(hostName, host_url);

      const webhookUuid = uuidv4();

      const updatedBody = {
        nocobase_id: body.nocobase_id,
        host_url: baseUrl,
        webhook_uuid: webhookUuid,
        remote_origin: hostName,
        repo_name,
        organization_name,
        token: repoToken,
      };

      const repository =
        await this.repositoryService.saveRepositoryDetails(updatedBody);

      return {
        message: StaticMessage.RepoDetailsSavedSuccessfully,
        data: {
          webhook_url: `${process.env.DOMAIN_BASE_URL}/api/webhook/${repository.webhook_uuid}`,
        },
      };
    } catch (error: any) {
      throw error;
    }
  }

  async updateRepositoryDetails(
    body: SaveRepositoryDetails,
    repoToken: string
  ) {
    try {
      const { host_url, nocobase_id, repo_url } = body;

      await this.repositoryService.fetchRepoDetailsByNocoBaseId(
        String(nocobase_id)
      );

      const {
        hostName,
        orgName: organization_name,
        repoName: repo_name,
      } = parseRepoUrl(repo_url);

      await this.repositoryVerificationValidator.SaveRepositoryDetails(body);

      await this.repositoryService.fetchRepoDetailsByName(
        organization_name,
        repo_name
      );

      const baseUrl = fetchBaseUrl(hostName, host_url);

      const webhookUuid = uuidv4();

      const updatedBody = {
        nocobase_id: nocobase_id,
        host_url: baseUrl,
        webhook_uuid: webhookUuid,
        remote_origin: hostName,
        repo_name,
        organization_name,
        token: repoToken,
      };

      const repository = await this.repositoryService.updateRepositoryDetails(
        String(nocobase_id),
        updatedBody
      );

      return {
        message: StaticMessage.RepoDetailsUpdatedSuccessfully,
        data: {
          webhook_url: `${process.env.DOMAIN_BASE_URL}/api/webhook/${repository.webhook_uuid}`,
        },
      };
    } catch (error: any) {
      throw error;
    }
  }

  async deleteRepository(body: DeleteRepositoryDetails) {
    try {
      const nocoBaseId = String(body.nocobase_id);

      const repository =
        await this.repositoryService.fetchRepoDetailsByNocoBaseId(nocoBaseId);

      return await this.repositoryService.deleteRepository(repository.uuid);
    } catch (error: any) {
      throw error;
    }
  }
}

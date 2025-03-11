import { RepositoryService } from "@/app/backend/services/repositories/repository.service";
import { RepositoryVerificationValidator } from "@/app/backend/validator/RepositoryVerificationValidator";
import { StaticMessage } from "@/app/backend/constants/StaticMessages";
import { SaveRepositoryDetails } from "@/app/backend/infrastructure/dtos/SaveRepositoryDetails";
import { v4 as uuidv4 } from "uuid";
import { parseRepoUrl } from "@/app/backend/utils/parseUrl";
import { fetchBaseUrl } from "@/app/backend/utils/fetchBaseUrl";
import { UpdateRepositoryDetails } from "../../infrastructure/dtos/UpdateRepositoryDetails";
import { WorkspaceService } from "@/app/backend/services/workspace/workspace.service";

export class RepositoryController {
  private repositoryService: RepositoryService;
  private workspaceService: WorkspaceService;

  private repositoryVerificationValidator: RepositoryVerificationValidator;

  constructor() {
    this.repositoryService = new RepositoryService();
    this.workspaceService = new WorkspaceService();
    this.repositoryVerificationValidator =
      new RepositoryVerificationValidator();
  }

  async verifyRepository(
    hostName: string,
    baseUrl: string,
    orgName: string,
    repoName: string,
    repoToken: string
  ) {
    try {
      const strategy = this.repositoryService.getStrategy(hostName);
      return await strategy.findRepositoryDetails(
        baseUrl,
        orgName,
        repoName,
        repoToken
      );
    } catch (error) {
      throw error;
    }
  }

  async saveRepositoryDetails(
    userUuid: string,
    body: SaveRepositoryDetails,
    repoToken: string
  ) {
    try {
      await this.repositoryVerificationValidator.SaveRepositoryDetails(body);

      const { host_url, repo_url, workspace_uuid } = body;
      const { hostName, orgName, repoName } = parseRepoUrl(repo_url);
      const baseUrl = fetchBaseUrl(hostName, host_url);

      // Verify repository existence
      await this.verifyRepository(
        hostName,
        baseUrl,
        orgName,
        repoName,
        repoToken
      );

      // Ensure workspace exists
      await this.workspaceService.fetchWorkspace(workspace_uuid);

      // Fetch repository details
      await this.repositoryService.fetchRepoDetailsByName(
        userUuid,
        orgName,
        repoName
      );

      // Prepare repository details
      const repositoryData = {
        user_uuid: userUuid,
        workspace_uuid,
        host_url: baseUrl,
        webhook_uuid: uuidv4(),
        remote_origin: hostName,
        repo_name: repoName,
        organization_name: orgName,
        token: repoToken,
        repo_url,
      };

      const repository =
        await this.repositoryService.saveRepositoryDetails(repositoryData);

      const {
        created_at,
        is_active,
        is_initialized,
        remote_origin,
        updated_at,
        uuid,
        webhook_uuid,
        user_uuid,
      } = repository;

      const response = {
        uuid,
        created_at,
        repo_url: repo_url,
        host_url: repository.host_url,
        is_active,
        is_initialized,
        organization_name: repository.organization_name,
        remote_origin,
        repo_name: repository.repo_name,
        updated_at,
        webhook_uuid,
        user_uuid,
        workspace_uuid,
        webhook_url: `${process.env.DOMAIN_BASE_URL}/api/v1/webhook/${repository.webhook_uuid}`,
      };
      return {
        message: StaticMessage.RepoDetailsSavedSuccessfully,
        data: response,
      };
    } catch (error) {
      throw error;
    }
  }

  async getRepositoryByUserAndWorkspaceUuid(
    userUuid: string,
    workspaceUuid: string
  ) {
    try {
      const repository =
        await this.repositoryService.fetchRepoDetailsByUserAndWorkspaceUuid(
          userUuid,
          workspaceUuid
        );

      const data = repository.map((item) => ({
        uuid: item.uuid,
        user_uuid: item.user_uuid,
        workspace_info: {
          uuid: item.workspace.uuid,
          name: item.workspace.name,
        },
        token: item.token,
        host_url: item.host_url,
        webhook_uuid: item.webhook_uuid,
        webhook_url: `${process.env.DOMAIN_BASE_URL}/api/v1/webhook/${item.webhook_uuid}`,
        remote_origin: item.remote_origin,
        organization_name: item.organization_name,
        repo_name: item.repo_name,
        repo_url: item.repo_url,
        is_active: item.is_active,
        is_initialized: item.is_initialized,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      return {
        message: StaticMessage.RepositoriesFetchedSuccessfully,
        data: data,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async getRepository(
    userUuid: string,
    workspaceUuid: string,
    repoUuid: string
  ) {
    try {
      await this.workspaceService.fetchWorkspace(workspaceUuid);

      const repository = await this.repositoryService.fetchRepoDetails(
        userUuid,
        workspaceUuid,
        repoUuid
      );

      return {
        message: StaticMessage.RepositoryFetchedSuccessfully,
        data: {
          uuid: repository.uuid,
          user_uuid: repository.user_uuid,
          workspace_info: {
            uuid: repository.workspace.uuid,
            name: repository.workspace.name,
          },
          host_url: repository.host_url,
          webhook_uuid: repository.webhook_uuid,
          webhook_url: `${process.env.DOMAIN_BASE_URL}/api/v1/webhook/${repository.webhook_uuid}`,
          remote_origin: repository.remote_origin,
          organization_name: repository.organization_name,
          repo_name: repository.repo_name,
          repo_url: repository.repo_url,
          is_active: repository.is_active,
          is_initialized: repository.is_initialized,
          created_at: repository.created_at,
          updated_at: repository.updated_at,
        },
      };
    } catch (error: any) {
      throw error;
    }
  }

  async updateRepositoryDetails(
    userUuid: string,
    workspaceUuid: string,
    repoUuid: string,
    body: UpdateRepositoryDetails,
    repoToken: string
  ) {
    try {
      const { host_url, repo_url } = body;

      const repository = await this.repositoryService.fetchRepoDetails(
        userUuid,
        workspaceUuid,
        repoUuid
      );

      const {
        hostName,
        orgName: organization_name,
        repoName: repo_name,
      } = parseRepoUrl(repo_url);

      await this.repositoryVerificationValidator.UpdateRepositoryDetails(body);

      await this.repositoryService.fetchRepoDetailsByName(
        userUuid,
        organization_name,
        repo_name
      );

      const baseUrl = fetchBaseUrl(hostName, host_url);

      const updatedBody = {
        user_uuid: userUuid,
        workspace_uuid: workspaceUuid,
        host_url: baseUrl,
        remote_origin: hostName,
        repo_name,
        organization_name,
        token: repoToken,
      };

      const updateRepository =
        await this.repositoryService.updateRepositoryDetails(
          repository.uuid,
          updatedBody
        );

      return {
        message: StaticMessage.RepoDetailsUpdatedSuccessfully,
        data: {
          uuid: updateRepository.uuid,
          user_uuid: updateRepository.user_uuid,
          workspace_info: {
            uuid: updateRepository.workspace.uuid,
            name: updateRepository.workspace.name,
          },
          host_url: updateRepository.host_url,
          webhook_uuid: updateRepository.webhook_uuid,
          webhook_url: `${process.env.DOMAIN_BASE_URL}/api/v1/webhook/${updateRepository.webhook_uuid}`,
          remote_origin: updateRepository.remote_origin,
          organization_name: updateRepository.organization_name,
          repo_name: updateRepository.repo_name,
          repo_url: updateRepository.repo_url,
          is_active: updateRepository.is_active,
          is_initialized: updateRepository.is_initialized,
          created_at: updateRepository.created_at,
          updated_at: updateRepository.updated_at,
        },
      };
    } catch (error: any) {
      throw error;
    }
  }

  async deleteRepository(
    userUuid: string,
    workspaceUuid: string,
    repoUuid: string
  ) {
    try {
      const repository = await this.repositoryService.fetchRepoDetails(
        userUuid,
        workspaceUuid,
        repoUuid
      );

      await this.repositoryService.deleteRepository(repository.uuid);
      return {
        message: StaticMessage.RepositoryDeletedSuccessfully,
        data: null,
      };
    } catch (error: any) {
      throw error;
    }
  }
}

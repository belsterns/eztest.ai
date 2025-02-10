import { RepositoryService } from "@/app/services/repositories/repository.service";
import { RepositoryVerificationValidator } from "@/app/validator/RepositoryVerificationValidator";
import { StaticMessage } from "@/app/constants/StaticMessages";

export class RepositoryController {
  private repositoryService: RepositoryService;
  private repositoryVerificationValidator: RepositoryVerificationValidator;

  constructor() {
    this.repositoryService = new RepositoryService();
    this.repositoryVerificationValidator =
      new RepositoryVerificationValidator();
  }

  async findRepositoryDetails(body: any, repoToken: string) {
    try {
      await this.repositoryVerificationValidator.ValidateRepository(body);

      const {
        host_url,
        remote_origin: remoteOrigin,
        organization_name: orgName,
        repo_name: repoName,
      } = body;

      let baseUrl;
      switch (remoteOrigin.toLowerCase()) {
        case "github":
          baseUrl = host_url ?? process.env.GITHUB_API_BASE_URL;
          break;
        case "gitlab":
          baseUrl = host_url ?? process.env.GITLAB_API_BASE_URL;
          break;
        case "bitbucket":
          baseUrl = host_url ?? process.env.BITBUCKET_API_BASE_URL;
          break;
        case "gitea":
          baseUrl = host_url ?? process.env.GITEA_API_BASE_URL;
          break;
        default:
          throw { statusCode: 400, message: "Unsupported remote origin" };
      }

      const strategy = this.repositoryService.getStrategy(remoteOrigin);
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
}

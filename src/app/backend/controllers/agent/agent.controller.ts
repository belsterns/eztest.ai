import { CreateBranchRequestDto } from "../../infrastructure/dtos/CreateBranchRequestDto";
import { FetchFileContentRequestDto } from "../../infrastructure/dtos/FetchFileContentRequestDto";
import { FetchModifiedFilesRequestDto } from "../../infrastructure/dtos/FetchModifiedFilesRequestDto";
import { fetchProvider } from "../../utils/fetchProvider";
import { AgentInteractionAPIValidator } from "../../validator/AgentInteractionAPIValidator";

export class AgentController {
  private agentInteractionAPIValidator: AgentInteractionAPIValidator;

  constructor() {
    this.agentInteractionAPIValidator = new AgentInteractionAPIValidator();
  }

  async fetchFileContent(body: FetchFileContentRequestDto) {
    try {
      await this.agentInteractionAPIValidator.ValidateFetchFileContent(body);

      const { provider, orgName, repoName } = await fetchProvider(body);

      return await provider.fetchFileContent(
        `${orgName}/${repoName}`,
        body.branch_name,
        body.file_path
      );
    } catch (error) {
      throw error;
    }
  }

  async fetchModifiedFiles(body: FetchModifiedFilesRequestDto) {
    try {
      await this.agentInteractionAPIValidator.ValidateFetchModifiedFiles(body);

      const { provider, orgName, repoName } = await fetchProvider(body);

      return await provider.fetchModifiedFiles(
        `${orgName}/${repoName}`,
        body.branch_name,
        body.changed_files
      );
    } catch (error) {
      throw error;
    }
  }

  async createBranch(body: CreateBranchRequestDto) {
    try {
      await this.agentInteractionAPIValidator.ValidateCreateBranch(body);

      const { provider, orgName, repoName } = await fetchProvider(body);

      return await provider.createBranch(
        `${orgName}/${repoName}`,
        body.base_branch,
        body.new_branch
      );
    } catch (error) {
      throw error;
    }
  }
}

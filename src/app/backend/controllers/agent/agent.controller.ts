import { CreateBranchRequestDto } from "../../infrastructure/dtos/CreateBranchRequestDto";
import { CreateNewFileRequestDto } from "../../infrastructure/dtos/CreateNewFileRequestDto";
import { CreatePullRequestDto } from "../../infrastructure/dtos/CreatePullRequestDto";
import { FetchFileContentRequestDto } from "../../infrastructure/dtos/FetchFileContentRequestDto";
import { FetchModifiedFilesRequestDto } from "../../infrastructure/dtos/FetchModifiedFilesRequestDto";
import { FolderPathDtoRequest } from "../../infrastructure/dtos/FolderPathDtoRequest";
import { GetAllBranchesRequestDto } from "../../infrastructure/dtos/GetAllBranchesRequestDto";
import { UpdateExistingFileRequestDto } from "../../infrastructure/dtos/UpdateExistingFileRequestDto";
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

  async createPullRequest(body: CreatePullRequestDto) {
    try {
      await this.agentInteractionAPIValidator.ValidateCreatePullRequest(body);

      const { head_branch, body: pullRequestBody, base_branch, title } = body;

      const { provider, orgName, repoName } = await fetchProvider(body);

      return await provider.createPullRequest(
        `${orgName}/${repoName}`,
        head_branch,
        base_branch,
        title,
        pullRequestBody
      );
    } catch (error) {
      throw error;
    }
  }

  async fetchFilesInFolderFromBranch(body: FolderPathDtoRequest) {
    try {
      await this.agentInteractionAPIValidator.ValidateFolderPathDtoRequest(
        body
      );

      const { branch_name, folder_path } = body;

      const { provider, orgName, repoName } = await fetchProvider(body);

      return await provider.fetchFilesInFolderFromBranch(
        `${orgName}/${repoName}`,
        branch_name,
        folder_path
      );
    } catch (error) {
      throw error;
    }
  }

  async getAllBranches(body: GetAllBranchesRequestDto) {
    try {
      await this.agentInteractionAPIValidator.ValidateGetAllBranches(body);

      const { provider, orgName, repoName } = await fetchProvider(body);

      return await provider.getAllBranches(`${orgName}/${repoName}`);
    } catch (error) {
      throw error;
    }
  }

  async updateExistingFile(body: UpdateExistingFileRequestDto) {
    try {
      await this.agentInteractionAPIValidator.validateUpdateExistingFile(body);

      const { branch_name, committer, content, file_path, message, sha } = body;

      const { provider, orgName, repoName } = await fetchProvider(body);

      return await provider.updateExistingFile(
        `${orgName}/${repoName}`,
        branch_name,
        file_path,
        message,
        committer,
        content,
        sha
      );
    } catch (error) {
      throw error;
    }
  }

  async createNewFile(body: CreateNewFileRequestDto) {
    try {
      await this.agentInteractionAPIValidator.validateCreateNewFile(body);

      const { branch_name, committer, content, file_path, message } = body;

      const { provider, orgName, repoName } = await fetchProvider(body);

      return await provider.createNewFile(
        `${orgName}/${repoName}`,
        branch_name,
        file_path,
        message,
        committer,
        content
      );
    } catch (error) {
      throw error;
    }
  }
}

import { providerMessage } from "../../constants/StaticMessages";
import { GitProvider } from "./GitProvider";

export class GitLabProvider implements GitProvider {
  constructor(
    private apiBaseUrl: string,
    private repoToken: string
  ) {}

  async fetchFileContent(
    repoFullName: string,
    branchName: string,
    filePath: string
  ): Promise<any | null> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/repository/files/${encodeURIComponent(filePath)}/raw?ref=${branchName}`,
        {
          method: "GET",
          headers: { "PRIVATE-TOKEN": this.repoToken },
        }
      );

      if (!response.ok) {
        throw {
          message: `Failed to fetch file content: ${response.status}- ${response.statusText}`,
          data: null,
          statusCode: response.status,
        };
      }

      const content = await response.text();
      const encodedContent = Buffer.from(content).toString("base64");

      const result = {
        name: filePath.split("/").pop(), // Extract filename
        path: filePath,
        sha: null, // GitLab API doesn't return SHA like GitHub; you may need an alternative
        size: content.length,
        url: `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/repository/files/${encodeURIComponent(filePath)}`,
        html_url: `https://gitlab.com/${repoFullName}/-/blob/${branchName}/${filePath}`,
        git_url: `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/repository/blobs/${branchName}`,
        download_url: `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/repository/files/${encodeURIComponent(filePath)}/raw?ref=${branchName}`,
        type: "file",
        content: encodedContent,
        encoding: "base64",
        _links: {
          self: `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/repository/files/${encodeURIComponent(filePath)}`,
          git: `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/repository/blobs/${branchName}`,
          html: `https://gitlab.com/${repoFullName}/-/blob/${branchName}/${filePath}`,
        },
      };

      return result;
    } catch (error: any) {
      console.error(
        `Error fetching content for file '${filePath}':`,
        error.message
      );
      return null;
    }
  }

  async fetchModifiedFiles(
    repoFullName: string,
    branchName: string,
    changedFiles: any
  ): Promise<any[]> {
    const files = [];

    for (const file of changedFiles) {
      if (file.status === "added" || file.status === "modified") {
        const content = await this.fetchFileContent(
          repoFullName,
          branchName,
          file.filename
        );
        files.push({
          name: file.filename,
          path: file.filename,
          type: file.status,
          content,
        });
      }
    }

    return files;
  }

  async createBranch(
    repoFullName: string,
    baseBranch: string,
    newBranch: string
  ): Promise<any> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/repository/branches`,
        {
          method: "POST",
          headers: {
            "PRIVATE-TOKEN": this.repoToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ branch: newBranch, ref: baseBranch }),
        }
      );

      if (!response.ok) {
        throw {
          message: `Failed to create branch: ${response.status} - ${response.statusText}`,
          data: null,
          statusCode: response.status,
        };
      }

      const responseData = await response.json();

      console.log(`Branch '${newBranch}' created successfully.`);

      return responseData;
    } catch (err) {
      throw err;
    }
  }

  async createPullRequest(
    repoFullName: string,
    headBranch: string,
    baseBranch: string,
    title: string,
    body: string
  ): Promise<void> {
    try {
      // Step 1: Verify if the base branch exists
      const branchExists = await this.checkBranchExists(
        repoFullName,
        baseBranch
      );
      if (!branchExists) {
        throw {
          message: `Failed to create pull request: Base branch '${baseBranch}' does not exist.`,
          data: null,
          statusCode: 404,
        };
      }

      // Step 2: Create the pull request
      const response = await fetch(
        `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/merge_requests`,
        {
          method: "POST",
          headers: {
            "PRIVATE-TOKEN": this.repoToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source_branch: headBranch,
            target_branch: baseBranch,
            title,
            description: body,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 409) {
          throw {
            message: `Failed to create pull request: ${providerMessage.PULL_REQUEST_ALREADY_EXISTS}`,
            data: null,
            statusCode: response.status,
          };
        }

        throw {
          message: `Failed to create pull request: ${response.statusText}`,
          data: null,
          statusCode: response.status,
        };
      }

      console.log(`Pull Request created successfully.`);
      const responseData = await response.json();
      return responseData;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Check if a branch exists in the repository.
   */
  async checkBranchExists(
    repoFullName: string,
    branchName: string
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/repository/branches/${encodeURIComponent(branchName)}`,
        {
          method: "GET",
          headers: {
            "PRIVATE-TOKEN": this.repoToken,
          },
        }
      );

      return response.ok; // Returns true if the branch exists, otherwise false.
    } catch (error) {
      console.error(`Error checking if branch '${branchName}' exists:`, error);
      return false;
    }
  }

  async fetchFilesInFolderFromBranch(
    repoFullName: string,
    branchName: string,
    folderPath: string
  ): Promise<{ name: string; path: string; type: string }[]> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/repository/tree?ref=${branchName}&path=${encodeURIComponent(folderPath)}`,
        {
          method: "GET",
          headers: { "PRIVATE-TOKEN": this.repoToken },
        }
      );

      if (!response.ok) {
        throw {
          message: `Failed to fetch files in folder: ${response.statusText}`,
          data: null,
          statusCode: response.status,
        };
      }

      const data = await response.json();

      return data.map((file: any) => ({
        name: file.name,
        path: file.path,
        type: file.type,
      }));
    } catch (error: any) {
      throw error;
    }
  }
}

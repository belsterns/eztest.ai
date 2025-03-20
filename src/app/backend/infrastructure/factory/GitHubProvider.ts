import axios from "axios";
import { GitProvider } from "./GitProvider";
import { providerMessage } from "../../constants/StaticMessages";

export class GitHubProvider implements GitProvider {
  constructor(
    private apiBaseUrl: string,
    private repoToken: string
  ) {}

  async fetchFileContent(
    repoFullName: string,
    branchName: string,
    filePath: string
  ): Promise<string | null> {
    try {
      const response = await axios.get(
        `${this.apiBaseUrl}/repos/${repoFullName}/contents/${filePath}?ref=${branchName}`,
        {
          headers: {
            Authorization: `token ${this.repoToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response.status) {
        throw {
          message: error.response.statusText,
          data: null,
          statusCode: error.response.status,
        };
      }
      throw error;
    }
  }

  async fetchModifiedFiles(
    repoFullName: string,
    branchName: string,
    changedFiles: { filename: string; status: string }[]
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
      const branchResponse = await axios.get(
        `${this.apiBaseUrl}/repos/${repoFullName}/git/ref/heads/${baseBranch}`,
        {
          headers: {
            Authorization: `token ${this.repoToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      const latestCommitSHA = branchResponse.data.object.sha;

      const response = await axios.post(
        `${this.apiBaseUrl}/repos/${repoFullName}/git/refs`,
        { ref: `refs/heads/${newBranch}`, sha: latestCommitSHA },
        {
          headers: {
            Authorization: `token ${this.repoToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      console.log(`Branch '${newBranch}' created successfully.`);

      return response.data;
    } catch (error: any) {
      // console.log("error in createBranch", error);
      console.log("error in createBranch", error.response);

      if (error.response.status === 404) {
        throw {
          message: error.response.statusText,
          data: null,
          statusCode: error.response.status,
        };
      }

      if (error.response.status === 422) {
        throw {
          message: providerMessage.BRANCH_ALREADY_EXISTS,
          data: null,
          statusCode: error.response.status,
        };
      }
      throw error;
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
      // Step 1: Verify that the new branch exists
      const branchCheckResponse = await axios.get(
        `${this.apiBaseUrl}/repos/${repoFullName}/branches/${headBranch}`,
        {
          headers: {
            Authorization: `token ${this.repoToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (branchCheckResponse.status !== 200) {
        throw new Error(`Branch '${headBranch}' not found.`);
      }

      // Step 2: Create Pull Request
      const response = await axios.post(
        `${this.apiBaseUrl}/repos/${repoFullName}/pulls`,
        {
          title,
          head: headBranch,
          base: baseBranch,
          body,
        },
        {
          headers: {
            Authorization: `token ${this.repoToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      console.log("Pull Request created successfully:", response.data);
      return response.data;
    } catch (error: any) {
      if (error.response.status === 404) {
        throw {
          message: error.response.statusText,
          data: null,
          statusCode: error.response.status,
        };
      }

      if (error.response.status === 422) {
        throw {
          message: providerMessage.PULL_REQUEST_ALREADY_EXISTS,
          data: null,
          statusCode: error.response.status,
        };
      }
      throw error;
    }
  }

  async fetchFilesInFolderFromBranch(
    repoFullName: string,
    branchName: string,
    folderPath: string
  ): Promise<{ name: string; path: string; type: string }[]> {
    try {
      const response = await axios.get(
        `${this.apiBaseUrl}/repos/${repoFullName}/contents/${folderPath}?ref=${branchName}`,
        {
          headers: {
            Authorization: `token ${this.repoToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      const files = response.data
        .filter((item: any) => item.type === "file")
        .map((file: any) => ({
          name: file.name,
          path: file.path,
          type: file.type,
        }));

      return files;
    } catch (error: any) {
      if (error.response.status) {
        throw {
          message: error.response.statusText,
          data: null,
          statusCode: error.response.status,
        };
      }
      throw error;
    }
  }
}

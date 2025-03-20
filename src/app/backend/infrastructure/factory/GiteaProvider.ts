import { GitProvider } from "./GitProvider";

export class GiteaProvider implements GitProvider {
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
        `${this.apiBaseUrl}/repos/${repoFullName}/contents/${filePath}?ref=${branchName}`,
        {
          method: "GET",
          headers: {
            Authorization: `token ${this.repoToken}`,
            Accept: "application/json",
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw {
          message: `Failed to fetch file content: ${response.statusText} - ${responseData.message}`,
          data: null,
          statusCode: response.status,
        };
      }

      return responseData;
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
      const apiUrl = `${this.apiBaseUrl}/repos/${repoFullName}/branches/${baseBranch}?access_token=${this.repoToken}`;

      const branchResponse = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!branchResponse.ok) {
        const errorText = await branchResponse.text();
        console.error("Error Response:", errorText);
        throw new Error(
          `Failed to fetch branch details: ${branchResponse.statusText}`
        );
      }

      const branchData = await branchResponse.json();

      const latestCommitSHA = branchData?.commit?.id || "SHA_NOT_FOUND";

      const [owner, repo] = repoFullName.split("/"); // Extract owner and repo separately

      const response = await fetch(
        `${this.apiBaseUrl}/repos/${owner}/${repo}/branches?access_token=${this.repoToken}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            new_branch_name: newBranch,
            old_branch_name: baseBranch,
            old_ref_name: latestCommitSHA,
          }),
        }
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw {
          message: `Failed to create branch: ${response.statusText} - ${responseData.message}`,
          data: null,
          statusCode: response.status,
        };
      }

      console.log(`Branch '${newBranch}' created successfully.`);

      return responseData;
    } catch (error: any) {
      throw error;
    }
  }

  async createPullRequest(
    repoFullName: string,
    headBranch: string,
    baseBranch: string,
    title: string,
    body: string
  ): Promise<any> {
    try {
      const [owner, repo] = repoFullName.split("/"); // Extract owner and repo separately

      const response = await fetch(
        `${this.apiBaseUrl}/repos/${owner}/${repo}/pulls`,
        {
          method: "POST",
          headers: {
            Authorization: `token ${this.repoToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            head: headBranch,
            base: baseBranch,
            title,
            body,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw {
          message: `Failed to create pull request: ${response.statusText} - ${responseData.message}`,
          data: null,
          statusCode: response.status,
        };
      }

      console.log(`Pull Request created successfully.`);
      return responseData;
    } catch (error: any) {
      console.error("Error creating Pull Request:", error.message);
      throw error;
    }
  }

  async fetchFilesInFolderFromBranch(
    repoFullName: string,
    branchName: string,
    folderPath: string
  ): Promise<{ name: string; path: string; type: string }[]> {
    try {
      const [owner, repo] = repoFullName.split("/"); // Extract owner and repo separately

      const response = await fetch(
        `${this.apiBaseUrl}/repos/${owner}/${repo}/contents/${folderPath}?ref=${branchName}`,
        {
          method: "GET",
          headers: {
            Authorization: `token ${this.repoToken}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw {
          message: `Failed to fetch files in folder: ${response.statusText}`,
          data: null,
          statusCode: response.status,
        };
      }

      const responseData = await response.json();

      return responseData.map((file: any) => ({
        name: file.name,
        path: file.path,
        type: file.type,
      }));
    } catch (error: any) {
      throw error;
    }
  }
}

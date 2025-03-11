import axios from "axios";
import { GitProvider } from "./GitProvider";

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

      return response.data.content; // Base64 encoded
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
  ): Promise<void> {
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

    await axios.post(
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
  }

  async createPullRequest(
    repoFullName: string,
    baseBranch: string,
    newBranch: string,
    title: string,
    body: string
  ): Promise<void> {
    try {
      await axios.post(
        `${this.apiBaseUrl}/repos/${repoFullName}/pulls`,
        { title, head: newBranch, base: baseBranch, body },
        {
          headers: {
            Authorization: `token ${this.repoToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      console.log(`Pull Request created successfully.`);
    } catch (error: any) {
      console.error("Error creating Pull Request:", error.message);
      throw error;
    }
  }
}

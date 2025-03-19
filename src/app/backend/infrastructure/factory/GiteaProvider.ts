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

      if (!response.ok) {
        throw new Error(`Failed to fetch file content: ${response.statusText}`);
      }

      return await response.json();
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
  ): Promise<void> {
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

      console.log(await response.json());

      // if (!response.ok)
      //   throw new Error(`Failed to create branch: ${response.statusText}`);

      console.log(`Branch '${newBranch}' created successfully.`);
    } catch (err) {
      throw err;
    }
  }

  async createPullRequest(
    repoFullName: string,
    baseBranch: string,
    newBranch: string,
    title: string,
    body: string
  ): Promise<void> {
    const response = await fetch(
      `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/merge_requests`,
      {
        method: "POST",
        headers: {
          "PRIVATE-TOKEN": this.repoToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_branch: newBranch,
          target_branch: baseBranch,
          title,
          description: body,
        }),
      }
    );

    if (!response.ok)
      throw new Error(`Failed to create pull request: ${response.statusText}`);

    console.log(`Pull Request created successfully.`);
  }
}

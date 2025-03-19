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

      const createBranchResponse = await fetch(
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

      if (!createBranchResponse.ok) {
        const errorText = await createBranchResponse.text();
        throw new Error(
          `Failed to create branch: ${createBranchResponse.statusText} - ${errorText}`
        );
      }

      console.log(`Branch '${newBranch}' created successfully.`);

      return createBranchResponse.json();
    } catch (error: any) {
      throw error;
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

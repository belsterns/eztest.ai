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
      console.log(repoFullName);
      const response = await fetch(
        `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/repository/files/${encodeURIComponent(filePath)}/raw?ref=${branchName}`,
        {
          method: "GET",
          headers: { "PRIVATE-TOKEN": this.repoToken },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch file content: ${response.statusText}`);
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
        const errorText = await response.text();
        throw new Error(
          `Failed to create branch: ${response.status} - ${response.statusText}\n${errorText}`
        );
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

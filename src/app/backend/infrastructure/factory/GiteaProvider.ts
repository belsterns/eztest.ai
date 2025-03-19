import { GitProvider } from "./GitProvider";
import prisma from "@/lib/prisma";

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

  async fetchAllFiles(repoFullName: string, branchName: string) {
    try {
      const [owner, repo] = repoFullName.split("/"); // Extract owner and repo separately

      const response = await fetch(
        `${this.apiBaseUrl}/repos/${owner}/${repo}/git/trees/${branchName}?recursive=1`,
        {
          headers: {
            Authorization: `token ${this.repoToken}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch repository files: ${response.statusText}`
        );
      }

      const data = await response.json();
      const files = data.tree.filter((item: any) => item.type === "blob"); // Filter only files

      // Fetch file content for each file
      const fileDetails = await Promise.all(
        files.map(async (file: any) => {
          const content = await this.fetchFileContent(
            repoFullName,
            file.path,
            branchName
          );
          return {
            path: file.path,
            content,
          };
        })
      );

      return fileDetails;
    } catch (error: any) {
      console.error("Error fetching all files:", error.message);
      throw new Error("Failed to fetch repository files.");
    }
  }

  async processFullRepo(
    userUuid: string,
    repoUuid: string,
    repoFullName: string,
    baseBranch: string
  ) {
    const repository = await prisma.repositories.findUnique({
      where: { uuid: repoUuid, user_uuid: userUuid, is_initialized: true },
    });

    if (repository) {
      throw {
        statusCode: 404,
        message:
          "Repository not found or it may have already been initialized. Please check the repository details.",
        data: null,
      };
    }

    const suffix = "_fullTest_by_Anand";
    const newBranch = `${baseBranch}${suffix}`;

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

    // Fetch all files in the repository
    const allFiles = await this.fetchAllFiles(repoFullName, baseBranch);

    // Update repository status
    await prisma.repositories.update({
      where: { uuid: repoUuid, user_uuid: userUuid },
      data: { is_initialized: true },
    });

    return {
      message: `Branch '${newBranch}' created successfully for full test generation.`,
      allFiles,
    };
  }

  async createOrUpdateFile(
    repoFullName: string,
    path: string,
    content: string,
    message: string,
    newBranch: string
  ) {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/repos/${encodeURIComponent(repoFullName)}/contents/${path}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${this.repoToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            branch: newBranch,
            committer: {
              name: "EZTest AI",
              email: "eztest.ai@commit.com",
            },
            content: Buffer.from(content).toString("base64"), // Encode content in base64
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create/update file: ${response.statusText}`);
      }

      console.log(`File '${path}' created or updated successfully.`);
    } catch (error: any) {
      console.error(
        `Error creating or updating file '${path}':`,
        error.message
      );
      throw error;
    }
  }
}

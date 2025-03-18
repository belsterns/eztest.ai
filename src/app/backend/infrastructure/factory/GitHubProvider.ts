import axios from "axios";
import { GitProvider } from "./GitProvider";
import prisma from "@/lib/prisma";

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

  async fetchAllFiles(repoFullName: string, branchName: string) {
    try {
      const response = await axios.get(
        `${this.apiBaseUrl}/repos/${repoFullName}/git/trees/${branchName}?recursive=1`,
        {
          headers: {
            Authorization: `token ${this.repoToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      const files = response.data.tree.filter(
        (item: any) => item.type === "blob"
      ); // Only files, ignore directories

      const fileDetails = await Promise.all(
        files.map(async (file: any) => {
          const content = await this.fetchFileContent(
            repoFullName,
            file.path,
            branchName
          );
          return {
            path: file.path,
            content, // Base64 encoded content
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

    console.log("newBranch ----------------->>", newBranch);

    console.log("repoToken ------------->>", this.repoToken);

    // Fetch the latest commit SHA
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

    // Create a new branch
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

    // Fetch all files in the repository
    const allFiles = await this.fetchAllFiles(repoFullName, baseBranch);

    //Langflow implementation

    // await prisma.repositories.update({
    //   where: { uuid: repoUuid, user_uuid: userUuid },
    //   data: { is_initialized: true },
    // });

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
      await axios.put(
        `${this.apiBaseUrl}/repos/${repoFullName}/contents/${path}`,
        {
          message,
          branch: newBranch,
          committer: {
            name: "EZTest AI",
            email: "eztest.ai@commit.com",
          },
          content,
        },
        {
          headers: {
            Authorization: `token ${this.repoToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
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

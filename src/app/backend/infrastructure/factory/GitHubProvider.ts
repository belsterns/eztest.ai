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

      return await axios.post(
        `${this.apiBaseUrl}/repos/${repoFullName}/git/refs`,
        { ref: `refs/heads/${newBranch}`, sha: latestCommitSHA },
        {
          headers: {
            Authorization: `token ${this.repoToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
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

  async createPullRequest(
    repoFullName: string,
    baseBranch: string,
    newBranch: string,
    title: string,
    body: string
  ): Promise<void> {
    try {
      return await axios.post(
        `${this.apiBaseUrl}/repos/${repoFullName}/pulls`,
        { title, head: newBranch, base: baseBranch, body },
        {
          headers: {
            Authorization: `token ${this.repoToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
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

  async processFullRepo(
    userUuid: string,
    repoUuid: string,
    repoFullName: string,
    baseBranch: string
  ) {
    try {
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

      const suffix = "_fullTest";
      const newBranch = `${baseBranch}${suffix}`;

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

      // Fetch all files in the repository
      const allFiles = await this.fetchAllFiles(repoFullName, baseBranch);

      //Langflow implementation

      await prisma.repositories.update({
        where: { uuid: repoUuid, user_uuid: userUuid },
        data: { is_initialized: true },
      });

      return {
        message: `Branch '${newBranch}' created successfully for full test generation.`,
        allFiles,
      };
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

  async createOrUpdateFile(
    repoFullName: string,
    path: string,
    content: string,
    message: string,
    newBranch: string
  ) {
    try {
      return await axios.put(
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

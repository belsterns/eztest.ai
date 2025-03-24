import { GitProvider } from "./GitProvider";
import { providerMessage } from "../../constants/StaticMessages";
import prisma from "@/lib/prisma";

export class GitHubProvider implements GitProvider {
  constructor(
    private apiBaseUrl: string,
    private repoToken: string
  ) {}

  private async fetchAPI(
    url: string,
    method: string = "GET",
    body?: any
  ): Promise<any> {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `token ${this.repoToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw {
          message: `Request failed: ${response.statusText}`,
          data: responseData,
          statusCode: response.status,
        };
      }

      return responseData;
    } catch (error: any) {
      throw error;
    }
  }

  async fetchFileContent(
    repoFullName: string,
    branchName: string,
    filePath: string
  ): Promise<string | null> {
    return this.fetchAPI(
      `${this.apiBaseUrl}/repos/${repoFullName}/contents/${filePath}?ref=${branchName}`
    );
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
    const branchData = await this.fetchAPI(
      `${this.apiBaseUrl}/repos/${repoFullName}/git/ref/heads/${baseBranch}`
    );

    return this.fetchAPI(
      `${this.apiBaseUrl}/repos/${repoFullName}/git/refs`,
      "POST",
      { ref: `refs/heads/${newBranch}`, sha: branchData.object.sha }
    );
  }

  async createPullRequest(
    repoFullName: string,
    headBranch: string,
    baseBranch: string,
    title: string,
    body: string
  ): Promise<void> {
    await this.fetchAPI(
      `${this.apiBaseUrl}/repos/${repoFullName}/branches/${headBranch}`
    );

    return this.fetchAPI(
      `${this.apiBaseUrl}/repos/${repoFullName}/pulls`,
      "POST",
      {
        title,
        head: headBranch,
        base: baseBranch,
        body,
      }
    );
  }

  async fetchFilesInFolderFromBranch(
    repoFullName: string,
    branchName: string,
    folderPath: string
  ): Promise<{ name: string; path: string; type: string }[]> {
    const response = await this.fetchAPI(
      `${this.apiBaseUrl}/repos/${repoFullName}/contents/${folderPath}?ref=${branchName}`
    );

    return Promise.all(
      response
        .filter((item: any) => item.type === "file")
        .map(async (file: any) => ({
          path: file.path,
          content: await this.fetchFileContent(
            repoFullName,
            branchName,
            file.path
          ),
        }))
    );
  }

  async fetchAllFiles(repoFullName: string, branchName: string) {
    const response = await this.fetchAPI(
      `${this.apiBaseUrl}/repos/${repoFullName}/git/trees/${branchName}?recursive=1`
    );

    return Promise.all(
      response.tree
        .filter((item: any) => item.type === "blob")
        .map(async (file: any) => ({
          path: file.path,
          content: await this.fetchFileContent(
            repoFullName,
            branchName,
            file.path
          ),
        }))
    );
  }

  async processFullRepo(
    userUuid: string,
    repoUuid: string,
    repoFullName: string,
    baseBranch: string
  ): Promise<any> {
    const repository = await prisma.repositories.findUnique({
      where: { uuid: repoUuid, user_uuid: userUuid, is_initialized: true },
    });

    if (repository) {
      throw {
        statusCode: 404,
        message:
          "Repository already initialized. Please check the repository details.",
        data: null,
      };
    }

    const suffix = "_fullTest";
    const newBranch = `${baseBranch}${suffix}`;

    const branchData = await this.fetchAPI(
      `${this.apiBaseUrl}/repos/${repoFullName}/git/ref/heads/${baseBranch}`
    );

    await this.fetchAPI(
      `${this.apiBaseUrl}/repos/${repoFullName}/git/refs`,
      "POST",
      { ref: `refs/heads/${newBranch}`, sha: branchData.object.sha }
    );

    const allFiles = await this.fetchAllFiles(repoFullName, baseBranch);

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
    return this.fetchAPI(
      `${this.apiBaseUrl}/repos/${repoFullName}/contents/${path}`,
      "PUT",
      {
        message,
        branch: newBranch,
        committer: {
          name: "EZTest AI",
          email: "eztest.ai@commit.com",
        },
        content,
      }
    );
  }

  async getAllBranches(repoFullName: string): Promise<string[]> {
    const response = await this.fetchAPI(
      `${this.apiBaseUrl}/repos/${repoFullName}/branches`
    );

    return response.map((branch: { name: string }) => branch.name);
  }

  async updateExistingFile(
    repoFullName: string,
    branchName: string,
    filePath: string,
    message: string,
    committer: { name: string; email: string },
    content: string,
    sha: string
  ): Promise<any> {
    return this.fetchAPI(
      `${this.apiBaseUrl}/repos/${repoFullName}/contents/${filePath}`,
      "PUT",
      {
        message,
        branch: branchName,
        committer: {
          name: committer.name,
          email: committer.email,
        },
        content: Buffer.from(content).toString("base64"),
        sha: sha
          ? sha
          : await this.getFileSha(repoFullName, filePath, branchName),
      }
    );
  }

  async getFileSha(
    repoFullName: string,
    filePath: string,
    branchName: string
  ): Promise<string> {
    const response = await this.fetchAPI(
      `${this.apiBaseUrl}/repos/${repoFullName}/contents/${filePath}?ref=${branchName}`
    );
    return response.sha;
  }

  async createNewFile(
    repoFullName: string,
    branchName: string,
    filePath: string,
    message: string,
    committer: { name: string; email: string },
    content: string
  ): Promise<any> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/repos/${repoFullName}/contents/${filePath}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${this.repoToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            committer,
            content: Buffer.from(content).toString("base64"),
            branch: branchName,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw {
          message: `Failed to create file: ${response.statusText} - ${responseData.message || ""}`,
          statusCode: response.status,
          data: responseData,
        };
      }

      return responseData;
    } catch (error: any) {
      throw error;
    }
  }
}

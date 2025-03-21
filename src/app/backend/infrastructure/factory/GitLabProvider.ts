import { GitProvider } from "./GitProvider";
import prisma from "@/lib/prisma";

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
        throw {
          message: `Failed to fetch file content: ${response.status} - ${response.statusText}`,
          data: null,
          statusCode: response.status,
        };
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
      throw error;
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

      if (!response.ok) {
        if (response.status === 400) {
          throw {
            message: `Failed to create branch details: ${newBranch} already exists`,
            data: null,
            statusCode: response.status,
          };
        } else {
          throw {
            message: `Failed to create branch details: ${response.status} - ${response.statusText}`,
            data: null,
            statusCode: response.status,
          };
        }
      }

      return await response.json();
    } catch (error) {
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

      if (!response.ok) {
        throw {
          message: `Failed to create pull request: ${response.status} - ${response.statusText}`,
          data: null,
          statusCode: response.status,
        };
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async fetchAllFiles(repoFullName: string, branchName: string) {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/projects/${encodeURIComponent(
          repoFullName
        )}/repository/tree?ref=${branchName}&recursive=true`,
        {
          method: "GET",
          headers: {
            "PRIVATE-TOKEN": this.repoToken,
          },
        }
      );

      if (!response.ok) {
        throw {
          message: `Failed to fetch repository tree: ${response.status} - ${response.statusText}`,
          data: null,
          statusCode: response.status,
        };
      }

      const files = (await response.json()).filter(
        (item: any) => item.type === "blob"
      ); // Only files, ignore directories

      // Fetch content for each file
      return await Promise.all(
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
    } catch (error: any) {
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

      // Fetch latest commit SHA from base branch
      const branchResponse = await fetch(
        `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/repository/branches/${baseBranch}`,
        {
          headers: { "PRIVATE-TOKEN": this.repoToken },
        }
      );

      if (!branchResponse.ok) {
        throw {
          message: `Failed to fetch branch details: ${branchResponse.status} - ${branchResponse.statusText}`,
          data: null,
          statusCode: branchResponse.status,
        };
      }

      // Create a new branch
      await this.createBranch(repoFullName, baseBranch, newBranch);

      const allFiles = await this.fetchAllFiles(repoFullName, baseBranch);

      await prisma.repositories.update({
        where: { uuid: repoUuid, user_uuid: userUuid },
        data: { is_initialized: true },
      });

      return {
        message: `Branch '${newBranch}' created successfully for full test generation.`,
        allFiles,
      };
    } catch (error) {
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
      const fileUrl = `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/repository/files/${encodeURIComponent(path)}?ref=${newBranch}`;
      const fileResponse = await fetch(fileUrl, {
        headers: { "PRIVATE-TOKEN": this.repoToken },
      });

      const fileExists = fileResponse.ok;
      const existingFileData = fileExists ? await fileResponse.json() : null;

      // Prepare payload
      const payload: {
        branch: string;
        content: string;
        commit_message: string;
        last_commit_id?: string;
      } = {
        branch: newBranch,
        content: Buffer.from(content).toString("base64"),
        commit_message: message,
      };

      const method = fileExists ? "PUT" : "POST";
      const apiUrl = fileExists
        ? `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/repository/files/${encodeURIComponent(path)}`
        : fileUrl;

      if (fileExists) {
        payload["last_commit_id"] = existingFileData.last_commit_id;
      }

      const response = await fetch(apiUrl, {
        method,
        headers: {
          "PRIVATE-TOKEN": this.repoToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw {
          message: `Failed to ${fileExists ? "update" : "create"} file: ${response.statusText}`,
          data: null,
          statusCode: response.status,
        };

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  }
}

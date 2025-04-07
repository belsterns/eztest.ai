import { providerMessage } from "../../constants/StaticMessages";
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
    headBranch: string,
    baseBranch: string,
    title: string,
    body: string
  ): Promise<void> {
    try {
      // Step 1: Verify if the base branch exists
      const branchExists = await this.checkBranchExists(
        repoFullName,
        baseBranch
      );
      if (!branchExists) {
        throw {
          message: `Failed to create pull request: Base branch '${baseBranch}' does not exist.`,
          data: null,
          statusCode: 404,
        };
      }

      // Step 2: Create the pull request
      const response = await fetch(
        `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/merge_requests`,
        {
          method: "POST",
          headers: {
            "PRIVATE-TOKEN": this.repoToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source_branch: headBranch,
            target_branch: baseBranch,
            title,
            description: body,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 409) {
          throw {
            message: `Failed to create pull request: ${providerMessage.PULL_REQUEST_ALREADY_EXISTS}`,
            data: null,
            statusCode: response.status,
          };
        }

        throw {
          message: `Failed to create pull request: ${response.statusText}`,
          data: null,
          statusCode: response.status,
        };
      }

      const responseData = await response.json();
      return responseData;
    } catch (error: any) {
      throw error;
    }
  }

  async checkBranchExists(
    repoFullName: string,
    branchName: string
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/repository/branches/${encodeURIComponent(branchName)}`,
        {
          method: "GET",
          headers: {
            "PRIVATE-TOKEN": this.repoToken,
          },
        }
      );

      return response.ok; // Returns true if the branch exists, otherwise false.
    } catch (error) {
      console.error(`Error checking if branch '${branchName}' exists:`, error);
      return false;
    }
  }

  async fetchFilesInFolderFromBranch(
    repoFullName: string,
    branchName: string,
    folderPath: string
  ): Promise<{ name: string; path: string; type: string }[]> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/repository/tree?ref=${branchName}&path=${encodeURIComponent(folderPath)}`,
        {
          method: "GET",
          headers: { "PRIVATE-TOKEN": this.repoToken },
        }
      );

      if (!response.ok) {
        throw {
          message: `Failed to fetch files in folder: ${response.statusText}`,
          data: null,
          statusCode: response.status,
        };
      }

      const data = await response.json();

      return data.map((file: any) => ({
        name: file.name,
        path: file.path,
        type: file.type,
      }));
    } catch (error: any) {
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
            branchName,
            file.path
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

  async getAllBranches(repoFullName: string): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/repository/branches`,
        {
          method: "GET",
          headers: {
            "PRIVATE-TOKEN": this.repoToken,
            Accept: "application/json",
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw {
          message: `Failed to fetch branches: ${response.statusText} - ${responseData.message || ""}`,
          data: null,
          statusCode: response.status,
        };
      }

      // Extract branch names from the response
      return responseData.map((branch: { name: string }) => branch.name);
    } catch (error: any) {
      throw error;
    }
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
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/repository/files/${encodeURIComponent(filePath)}`,
        {
          method: "PUT",
          headers: {
            "PRIVATE-TOKEN": this.repoToken,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            branch: branchName,
            content,
            commit_message: message,
            author_name: committer.name,
            author_email: committer.email,
            last_commit_id: sha
              ? sha
              : await this.getFileSha(repoFullName, filePath, branchName),
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw {
          message: `Failed to update file: ${response.statusText} - ${responseData.message || ""}`,
          statusCode: response.status,
          data: responseData,
        };
      }

      return responseData;
    } catch (error: any) {
      throw error;
    }
  }

  async getFileSha(
    repoFullName: string,
    filePath: string,
    branchName: string
  ): Promise<string> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/projects/${encodeURIComponent(
          repoFullName
        )}/repository/files/${encodeURIComponent(filePath)}?ref=${branchName}`,
        {
          method: "GET",
          headers: {
            "PRIVATE-TOKEN": this.repoToken,
            Accept: "application/json",
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          `Failed to fetch file SHA from GitLab: ${response.status} - ${responseData.message}`
        );
      }

      return responseData.blob_id;
    } catch (error: any) {
      throw error;
    }
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
        `${this.apiBaseUrl}/projects/${encodeURIComponent(repoFullName)}/repository/files/${encodeURIComponent(filePath)}`,
        {
          method: "POST",
          headers: {
            "PRIVATE-TOKEN": this.repoToken,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            branch: branchName,
            content, // GitLab automatically encodes it, so send raw content
            commit_message: message,
            author_name: committer.name,
            author_email: committer.email,
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

  async fetchModifiedFileContents(
    repoFullName: any,
    branchName: any,
    changedFiles: any
  ): Promise<any> {
    return {
      repoFullName,
      branchName,
      changedFiles,
    };
  }

  async processBranchAndFiles(
    // branchResponse: any,
    repoFullName: string,
    baseBranch: string,
    newBranch: string
  ): Promise<any> {
    return {
      baseBranch,
      // branchResponse,
      repoFullName,
      newBranch,
    };
  }

  async branchExists(repoFullName: string, branchName: string): Promise<any> {
    return {
      branchName,
      repoFullName,
    };
  }

  async fetchAndPull(
    repoFullName: string,
    baseBranch: string,
    newBranch: string
  ): Promise<any> {
    return {
      baseBranch,
      repoFullName,
      newBranch,
    };
  }

  async createOrUpdatePullRequest(
    repoFullName: string,
    baseBranch: string,
    newBranch: string
  ): Promise<any> {
    return {
      baseBranch,
      repoFullName,
      newBranch,
    };
  }
}

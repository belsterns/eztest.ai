import { NextResponse } from "next/server";
import { GitProvider } from "./GitProvider";
import prisma from "@/lib/prisma";
import fetch from "node-fetch";

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

      const responseData: any = await response.json();

      if (!response.ok) {
        throw {
          message: `Request failed: ${response.statusText} - ${responseData.message || ""}`,
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
    try {
      const repository = await prisma.repositories.findUnique({
        where: { uuid: repoUuid, user_uuid: userUuid, is_initialized: true },
      });

      if (repository) {
        throw new Error(
          "Repository already initialized. Please check the repository details."
        );
      }

      const newBranch = `${baseBranch}_fullTest`;

      const branchData = await this.fetchAPI(
        `${this.apiBaseUrl}/repos/${repoFullName}/git/ref/heads/${baseBranch}`
      );

      await this.fetchAPI(
        `${this.apiBaseUrl}/repos/${repoFullName}/git/refs`,
        "POST",
        { ref: `refs/heads/${newBranch}`, sha: branchData.object.sha }
      );

      // Fetch all file paths from the new branch
      const filePaths = await this.fetchAllFilePathsFromBranch(
        repoFullName,
        newBranch
      );

      // Run Langflow API for initialization
      const extractedFiles =
        await this.runLangflowRepoInitialization(filePaths);
      
      if(extractedFiles.length) {
          // Create new files in the repository
        await this.createExtractedFiles(repoFullName, newBranch, extractedFiles);

        // Create a pull request
        await this.createPullRequest(
          repoFullName,
          newBranch,
          baseBranch,
          "Initialize Repository with Test Cases",
          "This pull request initializes the repository by creating a new branch and adding test cases for validation. It includes auto-generated test files to enhance code coverage and maintainability."
        );
      }

      await prisma.repositories.update({
        where: { uuid: repoUuid, user_uuid: userUuid },
        data: { is_initialized: true },
      });

      return {
        message: `Repository initialized successfully, and '${newBranch}' was created for full test generation.`,
      };
    } catch (error) {
      throw error;
    }
  }

  private async runLangflowRepoInitialization(
    filePaths: string[]
  ): Promise<{ fileName: string; content: string }[]> {
    try {
      const response = await fetch(
        `https://${process.env.LANGFLOW_API_BASE_URL}/run/${process.env.LANGFLOW_REPO_INITIALIZE_WORKFLOW_ID}?stream=false`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": `${process.env.LANGFLOW_API_KEY}`,
          },
          body: JSON.stringify({
            output_type: "text",
            input_type: "text",
            tweaks: {
              [`${process.env.LANGFLOW_REPO_INITIALIZE_CUSTOM_COMPONENT_ID}`]: {
                input_value: JSON.stringify(filePaths),
              },
            },
          }),
        }
      );

      const result: any = await response.json();

      const apiTextData =
        result?.outputs?.[0]?.outputs?.[0]?.results?.text?.data?.text;
      if (!apiTextData) {
        console.error("Unexpected API response format.");
        throw {
          message: `Unexpected API response format.`,
          data: null,
          statusCode: 400,
        };
      }

      try {
        const parsedData = JSON.parse(apiTextData);
        return parsedData?.value?.map((file: any) => ({
          fileName: file.name,
          content: file.content,
        }));
      } catch (parseError) {
        throw parseError;
      }
    } catch (error: any) {
      throw error;
    }
  }

  private async createExtractedFiles(
    repoFullName: string,
    newBranch: string,
    extractedFiles: { fileName: string; content: string }[]
  ) {
    for (const file of extractedFiles) {
      try {
        await this.createNewFileForInitializeRepo(
          repoFullName,
          newBranch,
          file.fileName,
          `Created new file: ${file.fileName}`,
          {
            name: process.env.PR_COMMITER_NAME ?? "EZTest AI",
            email: process.env.PR_COMMITER_EMAIL ?? "eztest.ai@commit.com",
          },
          file.content
        );
      } catch (error) {
        throw error;
      }
    }
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
            content: content,
            branch: branchName,
            // sha: await this.getFileSha(repoFullName, filePath, branchName),
          }),
        }
      );

      const responseData: any = await response.json();

      if (!response.ok) {
        throw {
          message: `Failed to create/update file: ${response.statusText} - ${responseData.message || ""}`,
          statusCode: response.status,
          data: responseData,
        };
      }

      return responseData;
    } catch (error: any) {
      throw error;
    }
  }

  async createNewFileForInitializeRepo(
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
            content: content,
            branch: branchName,
          }),
        }
      );

      const responseData: any = await response.json();

      if (!response.ok) {
        throw {
          message: `Failed to create/update file: ${response.statusText} - ${responseData.message || ""}`,
          statusCode: response.status,
          data: responseData,
        };
      }

      return responseData;
    } catch (error: any) {
      throw error;
    }
  }

  // Function to fetch content for added/modified files only
  async fetchModifiedFileContents(
    repoFullName: any,
    branchName: any,
    changedFiles: any
  ): Promise<any> {
    const files = [];

    // Filter added/modified files and fetch their content
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
          content, // Include Base64-encoded content
        });
      }
    }
    return files;
  }

  async processBranchAndFiles(
    branchResponse: any,
    repoFullName: string,
    newBranch: string
  ): Promise<any> {
    try {
      const latestCommitSHA = branchResponse.object.sha;

      // Fetch the commit details
      const commitResponse = await fetch(
        `${this.apiBaseUrl}/repos/${repoFullName}/git/commits/${latestCommitSHA}`,
        {
          method: "GET",
          headers: {
            Authorization: `token ${this.repoToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!commitResponse.ok) {
        throw new Error(
          `Failed to fetch commit details: ${commitResponse.statusText}`
        );
      }

      const commitData: any = await commitResponse.json();
      const parentCommitSHA = commitData.parents?.[0]?.sha;

      if (!parentCommitSHA) {
        console.error("No parent commit found for the latest commit.");
        return NextResponse.json(
          { message: "No parent commit found for the latest commit" },
          { status: 400 }
        );
      }

      // Compare parent and latest commit
      const compareResponse = await fetch(
        `${this.apiBaseUrl}/repos/${repoFullName}/compare/${parentCommitSHA}...${latestCommitSHA}`,
        {
          method: "GET",
          headers: {
            Authorization: `token ${this.repoToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!compareResponse.ok) {
        throw new Error(
          `Failed to compare commits: ${compareResponse.statusText}`
        );
      }

      const compareData: any = await compareResponse.json();

      const changedFiles = compareData.files.map((file: any) => ({
        filename: file.filename,
        status: file.status,
        changes: file.changes,
      }));

      // Fetch modified file contents
      const repoFiles = await this.fetchModifiedFileContents(
        repoFullName,
        newBranch,
        changedFiles
      );

      const formattedRepoFiles = repoFiles.map((file: any) => ({
        name: file.name,
        path: file.path,
        type: file.type,
        content: file.content.content, // Extracting only the `content` field from `content`
      }));

      // Process Langflow response
      const langflowResponse = await fetch(
        `https://${process.env.LANGFLOW_API_BASE_URL}/run/${process.env.LANGFLOW_REPO_COMMIT_WORKFLOW_ID}?stream=false`,
        {
          method: "POST",
          headers: {
            "x-api-key": `${process.env.LANGFLOW_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            output_type: "text",
            input_type: "text",
            tweaks: {
              [`${process.env.LANGFLOW_REPO_COMMIT_CUSTOM_COMPONENT_ID}`]: {
                json_str: {
                  message: `Branch '${newBranch}' created successfully.`,
                  changedFiles,
                  formattedRepoFiles,
                },
                normalize_unicode: true,
                remove_control_chars: true,
                validate_json: true,
              },
            },
          }),
        }
      );

      const langflowData: any = await langflowResponse.json();

      if (!langflowResponse.ok) {
        throw {
          message: `Failed to process Langflow response: ${langflowResponse.statusText}`,
          data: langflowData,
          statusCode: langflowData?.status,
        };
      }

      const parsedData = JSON.parse(
        langflowData.outputs[0].outputs[0].results.text.data.text
      );

      // Create or update files in the new branch
      for (const file of parsedData.value) {
        await this.createNewFile(
          repoFullName,
          newBranch,
          file.name,
          `Adding test file: ${file.name}`,
          {
            name: process.env.PR_COMMITER_NAME ?? "EZTest AI",
            email: process.env.PR_COMMITER_EMAIL ?? "eztest.ai@commit.com",
          },
          file.content
        );
      }
    } catch (error: any) {
      console.error("Error in processBranchAndFiles function:", error);
      throw error;
    }
  }

  async fetchAllFilePathsFromBranch(repoFullName: string, branchName: string) {
    const response = await this.fetchAPI(
      `${this.apiBaseUrl}/repos/${repoFullName}/git/trees/${branchName}?recursive=1`
    );

    return response.tree
      .filter((item: any) => item.type === "blob")
      .map((file: any) => file.path);
  }
}

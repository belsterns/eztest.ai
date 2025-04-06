import { NextResponse } from "next/server";
import { GitProvider } from "./GitProvider";
import prisma from "@/lib/prisma";
import fetch from "node-fetch";
import { AzureChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export class GitHubProvider implements GitProvider {
  constructor(
    private apiBaseUrl: string,
    private repoToken: string
  ) {}

  async fetchAPI(
    url: string,
    method: string = "GET",
    body?: any
  ): Promise<any> {
    const headers: any = {
      Authorization: `token ${this.repoToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseText = await response.text();
    let responseData = {};

    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (err) {
      console.error("Failed to parse JSON from response:", responseText);
      throw err;
    }

    if (!response.ok) {
      throw {
        message: `Request failed: ${response.statusText}`,
        data: responseData,
        statusCode: response.status,
      };
    }

    return responseData;
  }

  async fetchFileContent(
    repoFullName: string,
    branchName: string,
    filePath: string
  ): Promise<any> {
    try {
      const data = this.fetchAPI(
        `${this.apiBaseUrl}/repos/${repoFullName}/contents/${filePath}?ref=${branchName}`
      );
      return data;
    } catch (error: any) {
      console.error(`Error in fetchFileContent:`, error);

      throw error;
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
    try {
      //Check if the headBranch exists
      await this.fetchAPI(
        `${this.apiBaseUrl}/repos/${repoFullName}/branches/${headBranch}`
      );

      //Create the Pull Request
      const response = await this.fetchAPI(
        `${this.apiBaseUrl}/repos/${repoFullName}/pulls`,
        "POST",
        {
          title,
          head: headBranch,
          base: baseBranch,
          body,
        }
      );

      return response;
    } catch (error: any) {
      console.error(`Error in createPullRequest:`, error);

      throw error;
    }
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

      if (extractedFiles.length) {
        // Create new files in the repository
        await this.createExtractedFiles(
          repoFullName,
          newBranch,
          extractedFiles
        );

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
    try {
      await this.fetchAPI(
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
    } catch (error) {
      console.error(`Error in updateExistingFile:`, error);

      throw error;
    }
  }

  async getFileSha(
    repoFullName: string,
    filePath: string,
    branchName: string
  ): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/repos/${repoFullName}/contents/${filePath}?ref=${branchName}`
      );

      if (response.status === 404) {
        console.warn("File not found, returning null.");
        return null;
      }

      if (!response.ok) {
        const errorData: any = await response.json();
        console.error("GitHub API error:", errorData);
        throw new Error(`Failed to fetch file SHA: ${errorData.message}`);
      }

      const data: any = await response.json();
      return data.sha;
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
      const fileSha = await this.getFileSha(repoFullName, filePath, branchName);

      const requestBody: any = {
        message,
        committer,
        content, // GitHub API requires Base64 encoded content
        branch: branchName,
      };

      if (fileSha) {
        requestBody.sha = fileSha;
      }

      const response = await fetch(
        `${this.apiBaseUrl}/repos/${repoFullName}/contents/${filePath}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${this.repoToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
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
    baseBranch: string,
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
        return { message: "No parent commit found for the latest commit" };
      }

      // Step 2: Compare commits to get changed files
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

      const changedFilePaths = changedFiles.map((f: any) => f.filename);

      await this.fetchAndPull(
        repoFullName,
        baseBranch,
        newBranch,
        changedFilePaths
      );

      const model = new AzureChatOpenAI({
        azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY!,
        azureOpenAIApiInstanceName: "azureopenai-BELSTERNS-southindia-dev-01",
        azureOpenAIApiVersion: "2024-10-01-preview",
        azureOpenAIApiDeploymentName: "gpt-4o-mini",
        temperature: 0.8,
      });

      const prompt = ChatPromptTemplate.fromTemplate(
        "You are an Express.js programmer. Your task is to analyze the provided file, whose file path is {filePath} and file content is {fileContent}, and to generate a Jest test case for the given code. Return the test file as an array of objects. Each object must contain a testPath, representing the expected file path for the Jest configuration, and a testContent, containing the required test file content, The response must be a strictly without any formatting such as markdown, backticks, or language annotations, and should not contain any extra characters."
      );

      const chain = prompt.pipe(model);

      for (const file of changedFiles) {
        const filePath = file.filename;

        const sourceContent = await this.getFileContent(
          repoFullName,
          filePath,
          baseBranch
        );

        if (!sourceContent) continue;

        let decodedFileContent = "";

        if (
          typeof sourceContent === "object" &&
          sourceContent.type === "file" &&
          typeof sourceContent.content === "string"
        ) {
          decodedFileContent = Buffer.from(
            sourceContent.content,
            sourceContent.encoding || "base64"
          ).toString("utf8");
        } else if (typeof sourceContent === "string") {
          decodedFileContent = sourceContent;
        } else {
          continue;
        }

        const response: any = await chain.invoke({
          filePath: filePath,
          fileContent: decodedFileContent,
        });

        const parsedContent =
          typeof response.content === "string"
            ? JSON.parse(response.content)
            : response.content;

        const testPath = parsedContent[0].testPath;
        const testContent = parsedContent[0].testContent;

        const testFileInUnitBranch = await this.getFileContent(
          repoFullName,
          testPath,
          newBranch
        );

        if (testFileInUnitBranch) {
          await this.updateExistingFile(
            repoFullName,
            newBranch,
            testPath,
            `Updated test for ${filePath}`,
            {
              name: process.env.PR_COMMITER_NAME ?? "EZTest AI",
              email: process.env.PR_COMMITER_EMAIL ?? "eztest.ai@commit.com",
            },
            testContent,
            testFileInUnitBranch.sha
          );
        } else {
          await this.createNewFile(
            repoFullName,
            newBranch,
            testPath,
            `Added test for ${filePath}`,
            {
              name: process.env.PR_COMMITER_NAME ?? "EZTest AI",
              email: process.env.PR_COMMITER_EMAIL ?? "eztest.ai@commit.com",
            },
            Buffer.from(testContent).toString("base64")
          );
        }
      }
    } catch (error: any) {
      console.error("Error in processBranchAndFiles function:", error);
      throw error;
    }
  }

  async mergeBranches(repoFullName: string, base: string, head: string) {
    const response = await fetch(
      `${this.apiBaseUrl}/repos/${repoFullName}/merges`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${this.repoToken}`,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          base: head, // Merge into this (unit test branch)
          head: base, // Merge from base branch
          commit_message: `Merge latest changes from ${base} into ${head}`,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to merge ${base} into ${head}: ${JSON.stringify(error)}`
      );
    }

    return await response.json();
  }

  async fetchAllFilePathsFromBranch(repoFullName: string, branchName: string) {
    const response = await this.fetchAPI(
      `${this.apiBaseUrl}/repos/${repoFullName}/git/trees/${branchName}?recursive=1`
    );

    return response.tree
      .filter((item: any) => item.type === "blob")
      .map((file: any) => file.path);
  }

  async branchExists(
    repoFullName: string,
    branchName: string
  ): Promise<any | false> {
    try {
      const branchData = await this.fetchAPI(
        `${this.apiBaseUrl}/repos/${repoFullName}/branches/${branchName}`,
        "GET"
      );

      return {
        ref: `refs/heads/${branchData.name}`,
        node_id: branchData.node_id || "",
        url: `${this.apiBaseUrl}/repos/${repoFullName}/git/refs/heads/${branchName}`,
        object: {
          sha: branchData.commit.sha,
          type: "commit",
          url: branchData.commit.url,
        },
      };
    } catch (error: any) {
      console.warn(
        `Warning: Could not fetch branch "${branchName}" in "${repoFullName}, ${error} -------->> "`
      );
      return false;
    }
  }

  async fetchAndPull(
    repoFullName: string,
    baseBranch: string,
    newBranch: string,
    changedFilePaths: string[]
  ): Promise<any> {
    try {
      // Confirm both branches exist
      await this.fetchAPI(
        `${this.apiBaseUrl}/repos/${repoFullName}/branches/${baseBranch}`,
        "GET"
      );
      await this.fetchAPI(
        `${this.apiBaseUrl}/repos/${repoFullName}/branches/${newBranch}`,
        "GET"
      );

      // Pre-fetch changed files (optional but helpful)
      for (const path of changedFilePaths) {
        await this.fetchFileContent(repoFullName, newBranch, path);
      }

      // Merge baseBranch into newBranch
      const mergeResponse = await this.fetchAPI(
        `${this.apiBaseUrl}/repos/${repoFullName}/merges`,
        "POST",
        {
          base: newBranch,
          head: baseBranch,
          commit_message: `Merging ${baseBranch} into ${newBranch} before test generation`,
        }
      );

      return mergeResponse;
    } catch (error: any) {
      if (error.message?.includes("Merge conflict")) {
        console.error("Merge conflict occurred");
        // Handle conflict logic here if needed
      } else {
        console.error("Error in fetchAndPull:", error);
      }
      throw error;
    }
  }

  async getFileContent(
    repoFullName: string,
    filePath: string,
    branchName: string
  ): Promise<string | any> {
    try {
      const url = `${this.apiBaseUrl}/repos/${repoFullName}/contents/${filePath}?ref=${branchName}`;

      const response = await fetch(url);

      if (response.status === 404) {
        console.warn("File not found on branch:", branchName);
        return null;
      }

      if (!response.ok) {
        const errorData: any = await response.json();
        throw new Error(`Failed to fetch file content: ${errorData.message}`);
      }

      const data: any = await response.json();

      // Check if it's a file and decode Base64
      if (data && data.type === "file" && data.content) {
        const buffer = Buffer.from(data.content, data.encoding || "base64");
        return buffer.toString("utf-8");
      }

      return null;
    } catch (error: any) {
      console.log("error in getFileContent ----------->>", error);

      throw error;
    }
  }

  async createOrUpdatePullRequest(
    repoFullName: string,
    baseBranch: string,
    newBranch: string
  ): Promise<any> {
    try {
      // Check if PR already exists
      const existingPRs = await this.fetchAPI(
        `${this.apiBaseUrl}/repos/${repoFullName}/pulls?head=${newBranch}&base=${baseBranch}&state=open`,
        "GET"
      );

      if (existingPRs.length > 0) {
        return {
          message: "Pull request already exists",
          pr_url: existingPRs[0].html_url,
        };
      }

      // Create a new PR if not found
      console.log(`No existing PR found. Creating a new PR...`);

      const title = `Add unit tests for branch ${baseBranch}`;
      const body = `This PR introduces unit tests for the changes made in the branch '${baseBranch}'.`;

      const newPR = await this.createPullRequest(
        repoFullName,
        newBranch,
        baseBranch,
        title,
        body
      );

      console.log(`PR created: ${newPR}`);
      return { message: "Pull request created successfully" };
    } catch (error) {
      console.log("Error in createOrUpdatePullRequest ----------->>", error);

      throw error;
    }
  }
}

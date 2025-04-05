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

      const newBranch: string = `${baseBranch}_fullTest`;

      const branchData = await this.fetchAPI(
        `${this.apiBaseUrl}/repos/${repoFullName}/git/ref/heads/${baseBranch}`
      );

      await this.fetchAPI(
        `${this.apiBaseUrl}/repos/${repoFullName}/git/refs`,
        "POST",
        {
          ref: `refs/heads/${newBranch}`,
          sha: branchData.object.sha,
        }
      );

      const files = await this.fetchAllFilePathsFromBranch(
        repoFullName,
        newBranch
      );
      const fileContent = await this.fetchAndDecodeFiles(files);

      const shouldExcludeFile = (filePath: string): boolean => {
        const lowerPath = filePath.toLowerCase();

        const exclusionPatterns = [
          /(^|\/)(package|requirements|pyproject|pom|build|makefile)[^/]*$/,
          /(^|\/)(jest|babel|tsconfig|eslint|vite|webpack|tailwind|prettier)\.config.*$/,
          /\.(lock|md|txt|json|yml|yaml|ini|toml|cfg)$/i,
          /\.(gitignore|dockerignore|gitattributes)$/i,
          /(^|\/)\.github(\/|$)/,
          /(^|\/)(readme|license)(\.|$)/,
        ];

        return exclusionPatterns.some((pattern) => pattern.test(lowerPath));
      };

      const supportedExtensions = [
        ".js",
        ".ts",
        ".jsx",
        ".tsx",
        ".py",
        ".java",
        ".go",
        ".rb",
        ".php",
        ".cs",
      ];

      const sourceFiles = fileContent.filter((item) => {
        const ext = item.filePath.toLowerCase();
        return (
          supportedExtensions.some((e) => ext.endsWith(e)) &&
          !shouldExcludeFile(ext)
        );
      });

      const model = new AzureChatOpenAI({
        azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
        azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
        azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
        azureOpenAIApiDeploymentName:
          process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
        temperature: Number(process.env.AZURE_OPENAI_API_TEMPERATURE),
      });

      const createdConfigs = new Set<string>();

      for (const file of sourceFiles) {
        if (!file.content) {
          console.warn(
            `Skipping file ${file.filePath} due to missing content.`
          );
          continue;
        }

        try {
          const prompt = ChatPromptTemplate.fromTemplate(`
          You are a developer specialized in multi-language applications (JavaScript, Python, Java, Go, PHP, Ruby, etc.).
          Analyze the code file at {file.filePath} and its content.
          Return an array of objects. Each object MUST have:
          - testPath: the path to the test file to be created
          - testContent: the content of the test
          If the code requires a test config (e.g., Jest, Pytest, Mocha), include an object with testPath as the config file and its testContent.
          Do NOT include markdown formatting, backticks, or explanations.
        `);

          const chain = prompt.pipe(model);
          const response: any = await chain.invoke({
            "file.filePath": file.filePath,
            "file.content": file.content,
          });

          const content =
            typeof response.content === "string"
              ? response.content
              : response.content?.toString() || "";

          let parsedvalue;
          try {
            parsedvalue = JSON.parse(content);
          } catch (parseError) {
            console.error(
              `Failed to parse test content for ${file.filePath}`,
              parseError
            );
            continue;
          }

          for (const testFile of parsedvalue) {
            const { testPath, testContent } = testFile;

            if (createdConfigs.has(testPath)) continue;

            const base64Content = Buffer.from(testContent).toString("base64");

            await this.createNewFileForInitializeRepo(
              repoFullName,
              newBranch,
              testPath,
              `Added test/config file: ${testPath}`,
              {
                name: process.env.PR_COMMITER_NAME ?? "EZTest AI",
                email: process.env.PR_COMMITER_EMAIL ?? "eztest.ai@commit.com",
              },
              base64Content
            );

            if (
              testPath.includes("config") ||
              testPath.includes("jest") ||
              testPath.includes("pytest") ||
              testPath.includes(".config")
            ) {
              createdConfigs.add(testPath);
            }
          }
        } catch (err) {
          console.error(`Error generating test for ${file.filePath}:`, err);
          continue;
        }
      }

      await this.createPullRequest(
        repoFullName,
        newBranch,
        baseBranch,
        `Initialize Repository with Tests`,
        `Auto-generated test files and configuration for source code.`
      );

      await prisma.repositories.update({
        where: { uuid: repoUuid, user_uuid: userUuid },
        data: { is_initialized: true },
      });

      return {
        message: `Repository initialized successfully. Branch '${newBranch}' created with test cases.`,
      };
    } catch (error) {
      console.error("Error in processFullRepo:", error);
      throw new Error(
        "Failed to fully initialize the repository. See logs for details."
      );
    }
  }

  private async fetchAndDecodeFiles(files: any) {
    const fileContents = await Promise.all(
      files.map(async (file: any) => {
        try {
          const response = await this.fetchAPI(file.url);

          const decodedContent = atob(response.content);
          return { filePath: file.filePath, content: decodedContent };
        } catch (error) {
          console.error(`Error fetching file ${file.filePath}:`, error);
          return { filePath: file.filePath, content: null };
        }
      })
    );
    return fileContents;
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
      .map((file: any) => ({
        filePath: file.path,
        sha: file.sha,
        url: file.url,
      }));
  }
}

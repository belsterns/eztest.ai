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
    console.log("~~~Create Branch Begins~~~")
    const branchData = await this.fetchAPI(
      `${this.apiBaseUrl}/repos/${repoFullName}/git/ref/heads/${baseBranch}`
    );
    console.log("branchData ==> ", branchData);
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
    console.log("~~~createPullRequest~~~");
    console.log("repoFullName:", repoFullName, "headBranch:", headBranch, "baseBranch:", baseBranch);
    console.log("title:", title, "body:", body);
  
    try {
      //Check if the headBranch exists
      await this.fetchAPI(`${this.apiBaseUrl}/repos/${repoFullName}/branches/${headBranch}`);
      
      console.log("VERIFIED: Head Branch Exists");
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
  
      console.log(`✅ Pull Request created successfully: ${response.html_url}`);
      return response;
  
    } catch (error: any) {
      console.error(`❌ Error in createPullRequest:`, JSON.stringify(error.data.errors));
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

  async getFileSha(repoFullName: string, filePath: string, branchName: string): Promise<string | null> {
    try {
      const response = await this.fetchAPI(
        `${this.apiBaseUrl}/repos/${repoFullName}/contents/${filePath}?ref=${branchName}`
      );
      return response.sha; 
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
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
      console.log("responseData : ", responseData);

      if (!response.ok) {
        throw {
          message: `Failed to create/update file: ${response.statusText} - ${responseData.message || ""}`,
          statusCode: response.status,
          data: responseData,
        };
      }

      await this.pushBranch(repoFullName, branchName);
      
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
      console.log("~~~Process Brach and Files Begin~~~");
      const latestCommitSHA = branchResponse.object.sha;

      console.log("latestCommitSHA :",latestCommitSHA)
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
      console.log("commitResponse :",commitResponse)

      if (!commitResponse.ok) {
        throw new Error(
          `Failed to fetch commit details: ${commitResponse.statusText}`
        );
      }

      const commitData: any = await commitResponse.json();
      console.log("commitData :",commitData)
      const parentCommitSHA = commitData.parents?.[0]?.sha;
      console.log("parentCommitSHA  :",parentCommitSHA)

      if (!parentCommitSHA) {
        console.error("No parent commit found for the latest commit.");
        return NextResponse.json(
          { message: "No parent commit found for the latest commit" },
          { status: 400 }
        );
      }

      console.log("compare parent and child sha");
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
      console.log("compareData :",compareData);

      const changedFiles = compareData.files.map((file: any) => ({
        filename: file.filename,
        status: file.status,
        changes: file.changes,
      }));
      console.log("changedFiles :",changedFiles);

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
      console.log("formattedRepoFiles :",formattedRepoFiles);

      console.log("~~~COMMIT: Langflow api begins~~~");
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
      console.log("langflowData :", langflowData);

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
      console.log("parsedData :", parsedData);

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

  async branchExists(repoFullName: string, branchName: string): Promise<any> {
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
          url: branchData.commit.url
        }
      };

    } catch (error: any) {
      console.log("error : branch Exists ==> " , error)
      if (error.data?.status === '404') {
        console.log("Branch not found!");
        return false;
      }
      throw error;
    }
  }

  async fetchAndPull(repoFullName: string, baseBranch: string, newBranch: string): Promise<any> {
    console.log(`Pulling latest changes from '${baseBranch}' into '${newBranch}'...`);
  
    try {
      // Get latest commit SHA of baseBranch
      const baseBranchData = await this.fetchAPI(
        `${this.apiBaseUrl}/repos/${repoFullName}/branches/${baseBranch}`,
        "GET"
      );
  
      const baseSha = baseBranchData.commit.sha;
      console.log(`baseSha': ${baseSha}`);
  
      //Update newBranch to match baseBranch (like a force pull)
      console.log("Taking a Pull");
  
      const resetResponse = await this.fetchAPI(
        `${this.apiBaseUrl}/repos/${repoFullName}/git/refs/heads/${newBranch}`,
        "PATCH",
        {
          sha: baseSha,
          force: true
        }
      );
  
      console.log(`✅ '${newBranch}' is now up to date with '${baseBranch}'.`);

      console.log(`🚀 Pushing '${newBranch}' to remote...`);

      await this.fetchAPI(
        `${this.apiBaseUrl}/repos/${repoFullName}/git/refs/heads/${newBranch}`,
        "PATCH",
        {
          sha: baseSha,
          force: true
        }
      );

      console.log(`✅ '${newBranch}' has been successfully pushed to remote.`);
  
      return resetResponse;
    } catch (error) {
      console.error(`Error in fetchAndPull:`, error);
      throw error;
    }
  }
  
  async createOrUpdatePullRequest(
    repoFullName: string,
    baseBranch: string,
    newBranch: string
  ): Promise<any> {
    console.log(`🔎 Checking if a Pull Request exists from '${newBranch}' to '${baseBranch}'...`);
  
    try {
      // Check if PR already exists
      const existingPRs = await this.fetchAPI(
        `${this.apiBaseUrl}/repos/${repoFullName}/pulls?head=${newBranch}&base=${baseBranch}&state=open`,
        "GET"
      );
  
      if (existingPRs.length > 0) {
        console.log(`PR already exists: ${existingPRs[0].html_url}`);
        return { message: "Pull request already exists", pr_url: existingPRs[0].html_url };
      }
  
      // Create a new PR if not found
      console.log(`📌 No existing PR found. Creating a new PR...`);
  
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
      throw error;
    }
  }
  
  async pushBranch(repoFullName: string, branchName: string): Promise<any> {
    console.log(`🚀 Pushing branch '${branchName}' to remote...`);
  
    try {
      // 1️⃣ Get latest commit SHA of the branch
      const branchData = await this.fetchAPI(
        `${this.apiBaseUrl}/repos/${repoFullName}/git/refs/heads/${branchName}`,
        "GET"
      );
  
      const branchSha = branchData.object.sha;
      console.log(`✅ Latest SHA of '${branchName}': ${branchSha}`);
  
      // 2️⃣ Update the reference of the branch to point to the latest commit
      const pushResponse = await this.fetchAPI(
        `${this.apiBaseUrl}/repos/${repoFullName}/git/refs/heads/${branchName}`,
        "PATCH",
        {
          sha: branchSha,
          force: true, // Use 'true' if you need to force push (be cautious)
        }
      );
  
      console.log(`✅ Branch '${branchName}' successfully pushed.`);
      return pushResponse;
    } catch (error) {
      console.error(`❌ Error pushing branch '${branchName}':`, error);
      throw error;
    }
  }
}

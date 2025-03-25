import { GitProvider } from "./GitProvider";
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
            content: content,
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

      console.log(
        "latestCommitSHA in processBranchAndFiles ------------->> 1",
        latestCommitSHA
      );

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

      console.log(
        "commitResponse in processBranchAndFiles ------------->> 2",
        commitResponse
      );

      if (!commitResponse.ok) {
        throw new Error(
          `Failed to fetch commit details: ${commitResponse.statusText}`
        );
      }

      const commitData = await commitResponse.json();
      const parentCommitSHA = commitData.parents?.[0]?.sha;

      console.log(
        "commitData in processBranchAndFiles ------------->> 3",
        commitData
      );

      console.log(
        "parentCommitSHA in processBranchAndFiles ------------->> 4",
        parentCommitSHA
      );

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

      console.log(
        "compareResponse in processBranchAndFiles ------------->> 5",
        compareResponse
      );

      if (!compareResponse.ok) {
        throw new Error(
          `Failed to compare commits: ${compareResponse.statusText}`
        );
      }

      const compareData = await compareResponse.json();

      console.log(
        "compareData in processBranchAndFiles ------------->> 6",
        compareData
      );

      const changedFiles = compareData.files.map((file: any) => ({
        filename: file.filename,
        status: file.status,
        changes: file.changes,
      }));

      console.log(
        "changedFiles in processBranchAndFiles ------------->> 7",
        changedFiles
      );

      // Create the new branch
      // const createBranchResponse = await fetch(
      //   `${this.apiBaseUrl}/repos/${repoFullName}/git/refs`,
      //   {
      //     method: "POST",
      //     headers: {
      //       Authorization: `token ${this.repoToken}`,
      //       Accept: "application/vnd.github.v3+json",
      //       "Content-Type": "application/json",
      //       "X-Triggered-By": "MyApp",
      //     },
      //     body: JSON.stringify({
      //       ref: `refs/heads/${newBranch}`,
      //       sha: latestCommitSHA,
      //     }),
      //   }
      // );

      // console.log(
      //   "createBranchResponse in processBranchAndFiles ------------->> 8",
      //   createBranchResponse
      // );

      // if (!createBranchResponse.ok) {
      //   throw new Error(
      //     `Failed to create branch: ${createBranchResponse.statusText}`
      //   );
      // }

      // Fetch modified file contents
      const repoFiles = await this.fetchModifiedFileContents(
        repoFullName,
        newBranch,
        changedFiles
      );

      console.log(
        "repoFiles in processBranchAndFiles ------------->> 9",
        repoFiles
      );

      console.log("newBranch" , newBranch);
      console.log("changedFiles", changedFiles);
      // console.log("repoFiles", repoFiles);

      const formattedRepoFiles = repoFiles.map((file:any) => ({
        name: file.name,
        path: file.path,
        type: file.type,
        content: file.content.content // Extracting only the `content` field from `content`
      }));

      console.log("formattedRepoFiles", formattedRepoFiles);

      // Process Langflow response
      const langflowResponse = await fetch(
        "https://langflow.belsterns.in/api/v1/run/cf96d88a-ede6-48c1-b803-b0b524ce5b63?stream=false",
        {
          method: "POST",
          headers: {
            "x-api-key" : `sk-VsrV7Vq9LWXQVZjzxJNazWQB1NwYpXPruD3J6ZgJV1c`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            output_type: "text",
            input_type: "text",
            tweaks: {
              "JSONCleaner-CIrPn": {
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

      console.log(
        "langflowResponse in processBranchAndFiles ------------->> 10",
        langflowResponse
      );

      if (!langflowResponse.ok) {
        throw new Error(
          `Failed to process Langflow response: ${langflowResponse.statusText}`
        );
      }

      const langflowData = await langflowResponse.json();

      console.log(
        "langflowData in processBranchAndFiles ------------->> 11",
        langflowData
      );

      const parsedData = JSON.parse(
        langflowData.outputs[0].outputs[0].results.text.data.text
      );

      console.log(
        "parsedData in processBranchAndFiles ------------->> 12",
        parsedData
      );

      // Create or update files in the new branch
      for (const file of parsedData.value) {
        await this.createNewFile(
          repoFullName,
          newBranch,
          file.name,
          `Adding test file: ${file.name}`,
          { name: "Automated Commit", email: "bot@example.com" },
          file.content
        );
      }
    } catch (error: any) {
      console.error("Error in dummy function:", error);
      throw error;
    }
  }
}


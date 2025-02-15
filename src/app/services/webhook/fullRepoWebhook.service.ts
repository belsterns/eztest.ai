import axios from "axios";
import prisma from "@/lib/prisma";

const GITHUB_API_BASE_URL = process.env.GITHUB_API_BASE_URL;

export class FullRepoWebhookService {
  async fetchFileContent(
    repoFullName: string,
    filePath: string,
    branchName: string,
    repoToken: string,
  ) {
    try {
      const response = await axios.get(
        `${GITHUB_API_BASE_URL}/repos/${repoFullName}/contents/${filePath}?ref=${branchName}`,
        {
          headers: {
            Authorization: `token ${repoToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      );
      return response.data.content; // Return base64 encoded content
    } catch (error: any) {
      console.error(
        `Error fetching content for file '${filePath}':`,
        error.message,
      );
      throw new Error(`Failed to fetch content for file '${filePath}'.`);
    }
  }

  async fetchAllFiles(
    repoFullName: string,
    branchName: string,
    repoToken: string,
  ) {
    try {
      const response = await axios.get(
        `${GITHUB_API_BASE_URL}/repos/${repoFullName}/git/trees/${branchName}?recursive=1`,
        {
          headers: {
            Authorization: `token ${repoToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      );
      const files = response.data.tree.filter(
        (item: any) => item.type === "blob",
      ); // Only files, ignore directories

      const fileDetails = await Promise.all(
        files.map(async (file: any) => {
          const content = await this.fetchFileContent(
            repoFullName,
            file.path,
            branchName,
            repoToken,
          );
          return {
            path: file.path,
            content, // Base64 encoded content
          };
        }),
      );
      return fileDetails;
    } catch (error: any) {
      console.error("Error fetching all files:", error.message);
      throw new Error("Failed to fetch repository files.");
    }
  }

  async processFullRepo(
    repoFullName: string,
    baseBranch: string,
    nocobaseId: string,
    repoToken: string,
  ) {
    const isInitialized = await prisma.repositories.findUnique({
      where: { nocobase_id: nocobaseId, is_initialized: true },
    });

    if (isInitialized) {
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
      `${GITHUB_API_BASE_URL}/repos/${repoFullName}/git/ref/heads/${baseBranch}`,
      {
        headers: {
          Authorization: `token ${repoToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    const latestCommitSHA = branchResponse.data.object.sha;

    // Create a new branch
    await axios.post(
      `${GITHUB_API_BASE_URL}/repos/${repoFullName}/git/refs`,
      { ref: `refs/heads/${newBranch}`, sha: latestCommitSHA },
      {
        headers: {
          Authorization: `token ${repoToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    console.log(`Branch '${newBranch}' created successfully.`);

    // Fetch all files in the repository
    const allFiles = await this.fetchAllFiles(
      repoFullName,
      baseBranch,
      repoToken,
    );

    //Langflow implementation

    await prisma.repositories.update({
      where: { nocobase_id: nocobaseId },
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
    newBranch: string,
    repoToken: string,
  ) {
    try {
      await axios.put(
        `${GITHUB_API_BASE_URL}/repos/${repoFullName}/contents/${path}`,
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
            Authorization: `token ${repoToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      );
      console.log(`File '${path}' created or updated successfully.`);
    } catch (error: any) {
      console.error(
        `Error creating or updating file '${path}':`,
        error.message,
      );
      throw error;
    }
  }

  async createPullRequest(
    repoFullName: string,
    baseBranch: string,
    newBranch: string,
    title: string,
    body: string,
    repoToken: string,
  ) {
    try {
      const response = await axios.post(
        `${GITHUB_API_BASE_URL}/repos/${repoFullName}/pulls`,
        { title, head: newBranch, base: baseBranch, body },
        {
          headers: {
            Authorization: `token ${repoToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      );

      console.log(
        `Pull Request created successfully: ${response.data.html_url}`,
      );
    } catch (error: any) {
      console.error("Error creating Pull Request:", error.message);
      throw error;
    }
  }
}

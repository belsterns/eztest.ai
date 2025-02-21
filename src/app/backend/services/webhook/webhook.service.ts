import axios from "axios";
import prisma from "@/lib/prisma";
import { decryptToken } from "@/app/backend/utils/cryptoUtils";
import { StaticMessage } from "@/app/backend/constants/StaticMessages";

export class WebhookService {
  async findRepositoryByWebhookUuid(webhookUuid: string) {
    const repository = await prisma.repositories.findUnique({
      where: {
        webhook_uuid: webhookUuid,
      },
    });

    if (!repository) {
      throw {
        statusCode: 404,
        message: StaticMessage.RepositoryNotFound,
        data: null,
      };
    }
    return repository;
  }

  async createPullRequest(
    repoFullName: string,
    baseBranch: string,
    newBranch: string,
    title: string,
    body: string,
    apiBaseUrl: string,
    repoToken: string,
  ) {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/repos/${repoFullName}/pulls`,
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

  async fetchFileContent(
    repoFullName: string,
    branchName: string,
    filePath: string,
    apiBaseUrl: string,
    repoToken: string,
  ) {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/repos/${repoFullName}/contents/${filePath}?ref=${branchName}`,
        {
          headers: {
            Authorization: `token ${repoToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      );

      return response.data.content;
    } catch (error: any) {
      console.error(
        `Error fetching content for file '${filePath}':`,
        error.message,
      );
      return null;
    }
  }

  async fetchModifiedFileContents(
    repoFullName: string,
    branchName: string,
    changedFiles: any,
    apiBaseUrl: string,
    repoToken: string,
  ) {
    const files = [];

    for (const file of changedFiles) {
      if (file.status === "added" || file.status === "modified") {
        const content = await this.fetchFileContent(
          repoFullName,
          branchName,
          file.filename,
          apiBaseUrl,
          repoToken,
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

  async createOrUpdateFile(
    repoFullName: string,
    path: string,
    content: string,
    message: string,
    newBranch: string,
    apiBaseUrl: string,
    repoToken: string,
  ) {
    try {
      await axios.put(
        `${apiBaseUrl}/repos/${repoFullName}/contents/${path}`,
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

  async processWebhook(
    repoFullName: string,
    baseBranch: string,
    webhookUuid: string,
  ) {
    const suffix = "_unitTest";
    const newBranch = `${baseBranch}${suffix}`;

    const repository = await this.findRepositoryByWebhookUuid(webhookUuid);
    const apiBaseUrl = repository.host_url;
    const repoToken = decryptToken(repository.token);

    if (baseBranch.endsWith("__fullTest")) {
      console.log(
        `Branch '${baseBranch}' ends with '__fullTest'. Skipping branch creation.`,
      );
      return {
        message: `Branch '${baseBranch}' is a full test branch. No further action is taken.`,
      };
    }

    const branchResponse = await axios.get(
      `${apiBaseUrl}/repos/${repoFullName}/git/ref/heads/${baseBranch}`,
      {
        headers: {
          Authorization: `token ${repoToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    const latestCommitSHA = branchResponse.data.object.sha;
    const commitResponse = await axios.get(
      `${apiBaseUrl}/repos/${repoFullName}/git/commits/${latestCommitSHA}`,
      {
        headers: {
          Authorization: `token ${repoToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    const parentCommitSHA = commitResponse.data.parents?.[0]?.sha;

    if (!parentCommitSHA)
      throw new Error("No parent commit found for the latest commit.");

    const compareResponse = await axios.get(
      `${apiBaseUrl}/repos/${repoFullName}/compare/${parentCommitSHA}...${latestCommitSHA}`,
      {
        headers: {
          Authorization: `token ${repoToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    const changedFiles = compareResponse.data.files.map((file: any) => ({
      filename: file.filename,
      status: file.status,
      changes: file.changes,
    }));

    console.log("Changed Files:", changedFiles);

    await axios.post(
      `${apiBaseUrl}/repos/${repoFullName}/git/refs`,
      { ref: `refs/heads/${newBranch}`, sha: latestCommitSHA },
      {
        headers: {
          Authorization: `token ${repoToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    console.log(`Branch '${newBranch}' created successfully.`);

    const repoFiles = await this.fetchModifiedFileContents(
      repoFullName,
      newBranch,
      changedFiles,
      apiBaseUrl,
      repoToken,
    );

    const langflowResponse = await axios.post(
      `https://${process.env.LANG_FLOW_BASE_URL}/run/42811f5a-1d78-43ba-8641-b01282f9a28e?stream=false`,
      {
        output_type: "text",
        input_type: "text",
        tweaks: {
          "JSONCleaner-dGenj": {
            json_str: JSON.stringify({
              message: `Branch '${newBranch}' created successfully.`,
              changedFiles,
              repoFiles,
            }),
            normalize_unicode: true,
            remove_control_chars: true,
            validate_json: true,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer YOUR_API_KEY`,
          "Content-Type": "application/json",
        },
      }
    );

    const langFlowData = JSON.parse(
      langflowResponse.data.outputs[0].outputs[0].results.text.data.text,
    );
    for (const file of langFlowData.value) {
      await this.createOrUpdateFile(
        repoFullName,
        file.name,
        file.content,
        `Adding test file: ${file.name}`,
        newBranch,
        apiBaseUrl,
        repoToken,
      );
    }

    const title = `Add unit tests for branch ${baseBranch}`;
    const body = `This PR introduces unit tests for the changes made in the branch '${baseBranch}'.`;

    await this.createPullRequest(
      repoFullName,
      baseBranch,
      newBranch,
      title,
      body,
      apiBaseUrl,
      repoToken,
    );

    return {
      message: `Branch '${newBranch}' created successfully.`,
      changedFiles,
      repoFiles,
    };
  }
}

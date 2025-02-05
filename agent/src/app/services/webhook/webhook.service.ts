import axios from "axios";

const GITHUB_API_BASE_URL = process.env.GITHUB_API_BASE_URL;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // GitHub token

export class WebhookService {
  async createPullRequest(
    repoFullName: string,
    baseBranch: string,
    newBranch: string,
    title: string,
    body: string
  ) {
    try {
      const response = await axios.post(
        `${GITHUB_API_BASE_URL}/repos/${repoFullName}/pulls`,
        { title, head: newBranch, base: baseBranch, body },
        {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      console.log(
        `Pull Request created successfully: ${response.data.html_url}`
      );
    } catch (error: any) {
      console.error("Error creating Pull Request:", error.message);
      throw error;
    }
  }

  async fetchFileContent(
    repoFullName: string,
    branchName: string,
    filePath: string
  ) {
    try {
      const response = await axios.get(
        `${GITHUB_API_BASE_URL}/repos/${repoFullName}/contents/${filePath}?ref=${branchName}`,
        {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      return response.data.content;
    } catch (error: any) {
      console.error(
        `Error fetching content for file '${filePath}':`,
        error.message
      );
      return null;
    }
  }

  async fetchModifiedFileContents(
    repoFullName: string,
    branchName: string,
    changedFiles: any
  ) {
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

  async createOrUpdateFile(
    repoFullName: string,
    path: string,
    content: string,
    message: string,
    newBranch: string
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
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      console.log(`File '${path}' created or updated successfully.`);
    } catch (error: any) {
      console.error(
        `Error creating or updating file '${path}':`,
        error.message
      );
      throw error;
    }
  }

  async processWebhook(repoFullName: string, baseBranch: string, payload: any) {
    const suffix = "_unitTest";
    const newBranch = `${baseBranch}${suffix}`;

    const branchResponse = await axios.get(
      `${GITHUB_API_BASE_URL}/repos/${repoFullName}/git/ref/heads/${baseBranch}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const latestCommitSHA = branchResponse.data.object.sha;
    const commitResponse = await axios.get(
      `${GITHUB_API_BASE_URL}/repos/${repoFullName}/git/commits/${latestCommitSHA}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const parentCommitSHA = commitResponse.data.parents?.[0]?.sha;

    if (!parentCommitSHA)
      throw new Error("No parent commit found for the latest commit.");

    const compareResponse = await axios.get(
      `${GITHUB_API_BASE_URL}/repos/${repoFullName}/compare/${parentCommitSHA}...${latestCommitSHA}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const changedFiles = compareResponse.data.files.map((file: any) => ({
      filename: file.filename,
      status: file.status,
      changes: file.changes,
    }));

    console.log("Changed Files:", changedFiles);

    await axios.post(
      `${GITHUB_API_BASE_URL}/repos/${repoFullName}/git/refs`,
      { ref: `refs/heads/${newBranch}`, sha: latestCommitSHA },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    console.log(`Branch '${newBranch}' created successfully.`);

    const repoFiles = await this.fetchModifiedFileContents(
      repoFullName,
      newBranch,
      changedFiles
    );

    const langflowResponse = await axios.post(
      "https://llmops.ezxplore.com/api/v1/run/42811f5a-1d78-43ba-8641-b01282f9a28e?stream=false",
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

    let langFlowData = JSON.parse(
      langflowResponse.data.outputs[0].outputs[0].results.text.data.text
    );
    for (const file of langFlowData.value) {
      await this.createOrUpdateFile(
        repoFullName,
        file.name,
        file.content,
        `Adding test file: ${file.name}`,
        newBranch
      );
    }

    const title = `Add unit tests for branch ${baseBranch}`;
    const body = `This PR introduces unit tests for the changes made in the branch '${baseBranch}'.`;

    await this.createPullRequest(
      repoFullName,
      baseBranch,
      newBranch,
      title,
      body
    );

    return {
      message: `Branch '${newBranch}' created successfully.`,
      changedFiles,
      repoFiles,
    };
  }
}

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const GITHUB_API_BASE_URL = "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Add your GitHub token in .env file

async function createPullRequest(
  repoFullName: string,
  baseBranch: string,
  newBranch: string,
  title: string,
  body: string
): Promise<void> {
  try {
    const response = await axios.post(
      `${GITHUB_API_BASE_URL}/repos/${repoFullName}/pulls`,
      {
        title, // PR title
        head: newBranch, // Branch with your changes
        base: baseBranch, // Branch to merge into
        body, // PR description
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    console.log(`Pull Request created successfully: ${response.data.html_url}`);
  } catch (error: any) {
    console.error("Error creating Pull Request:", error.message);
  }
}

// Function to fetch file content in Base64 format
async function fetchFileContent(
  repoFullName: any,
  branchName: any,
  filePath: any
): Promise<any> {
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

// Function to fetch content for added/modified files only
async function fetchModifiedFileContents(
  repoFullName: any,
  branchName: any,
  changedFiles: any
): Promise<any> {
  const files = [];

  // Filter added/modified files and fetch their content
  for (const file of changedFiles) {
    if (file.status === "added" || file.status === "modified") {
      const content = await fetchFileContent(
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

// Function to create or update files in GitHub
async function createOrUpdateFile(
  repoFullName: string,
  path: string,
  content: string,
  message: string,
  newBranch: string
): Promise<void> {
  try {
    const response = await axios.put(
      `${GITHUB_API_BASE_URL}/repos/${repoFullName}/contents/${path}`,
      {
        message,
        branch: newBranch,
        committer: {
          name: "Automated Commit",
          email: "automated@commit.com",
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

    console.log(
      `File '${path}' created or updated successfully:`,
      response.data
    );
  } catch (error: any) {
    console.error(`Error creating or updating file '${path}':`, error.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const branchRef = payload.ref;
    const repoFullName = payload.repository.full_name;

    if (!branchRef || !branchRef.startsWith("refs/heads/")) {
      return NextResponse.json(
        { message: "Not a branch commit or invalid event type" },
        { status: 400 }
      );
    }

    const baseBranch = branchRef.replace("refs/heads/", "");

    if (baseBranch.endsWith("_unitTest")) {
      console.log("Skipping webhook for unit test branch:", baseBranch);
      return NextResponse.json(
        { message: "Skipping webhook for unit test branch" },
        { status: 200 }
      );
    }

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
    if (!parentCommitSHA) {
      console.error("No parent commit found for the latest commit.");
      return NextResponse.json(
        { message: "No parent commit found for the latest commit" },
        { status: 400 }
      );
    }

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
      {
        ref: `refs/heads/${newBranch}`,
        sha: latestCommitSHA,
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "X-Triggered-By": "MyApp",
        },
      }
    );

    console.log(`Branch '${newBranch}' created successfully.`);

    const repoFiles = await fetchModifiedFileContents(
      repoFullName,
      newBranch,
      changedFiles
    );

    // Process Langflow response
    const langflowResponse = await axios.post(
      "https://llmops.ezxplore.com/api/v1/run/42811f5a-1d78-43ba-8641-b01282f9a28e?stream=false", // Replace with your actual Langflow API URL
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
          Authorization: `Bearer sk-0_AqgRr82Nfx2mjIJ1nNqK76sncHhfcLCocyL-Tr0HI`, // Replace with your API key if required
          "Content-Type": "application/json",
        },
      }
    );

    let langFlowData =
      JSON.parse(langflowResponse.data.outputs[0].outputs[0].results.text.data.text);

    for (const file of langFlowData.value) {
      await createOrUpdateFile(
        payload.repository.full_name,
        file.name,
        file.content,
        `Adding test file: ${file.name}`,
        newBranch
      );
    }

    const title = `Add unit tests for branch ${baseBranch}`;
    const body = `This PR introduces unit tests for the changes made in the branch '${baseBranch}'.`;

    // Create the Pull Request
    await createPullRequest(repoFullName, baseBranch, newBranch, title, body);

    console.log("Response:", {
      message: `Branch '${newBranch}' created successfully.`,
      changedFiles,
      repoFiles,
    });

    return NextResponse.json(
      {
        message: `Branch '${newBranch}' created successfully.`,
        changedFiles,
        repoFiles,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(
      "Error processing webhook:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      {
        message: "Failed to process webhook",
        error: error,
      },
      { status: 500 }
    );
  }
}

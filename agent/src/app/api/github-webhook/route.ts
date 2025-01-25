import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const GITHUB_API_BASE_URL = "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Add your GitHub token in .env file

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

    const repoFiles = await fetchModifiedFileContents(repoFullName, newBranch, changedFiles);

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
        error: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}

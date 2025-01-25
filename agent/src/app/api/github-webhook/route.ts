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
    const langflowResponse = {
      repoFiles: [
        {
          name: "tests/app.test.js",
          path: "tests/app.test.js",
          type: "added",
          content:
            "Y29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTsKY29uc3QgZnMg\nPSByZXF1aXJlKCdmcycpOwpjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcp\nOwoKY29uc3QgYXBwID0gZXhwcmVzcygpOwpjb25zdCBQT1JUID0gNDAwMDsK\nY29uc3QgREFUQV9GSUxFID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ3Rhc2tz\nLmpzb24nKTsKCi8vIE1pZGRsZXdhcmUgdG8gcGFyc2UgSlNPTgphcHAudXNl\nKGV4cHJlc3MuanNvbigpKTsKCi8vIEhlbHBlciBmdW5jdGlvbiB0byByZWFk\nIHRhc2tzIGZyb20gdGhlIEpTT04gZmlsZQpmdW5jdGlvbiByZWFkVGFza3Mo\nKSB7CiAgICBpZiAoIWZzLmV4aXN0c1N5bmMoREFUQV9GSUxFKSkgewogICAg\nICAgIHJldHVybiBbXTsKICAgIH0KICAgIGNvbnN0IGRhdGEgPSBmcy5yZWFk\nRmlsZVN5bmMoREFUQV9GSUxFKTsKICAgIHJldHVybiBKU09OLnBhcnNlKGRh\ndGEpOwp9CgovLyBIZWxwZXIgZnVuY3Rpb24gdG8gd3JpdGUgdGFza3MgdG8g\ndGhlIEpTT04gZmlsZQpmdW5jdGlvbiB3cml0ZVRhc2tzKHRhc2tzKSB7CiAg\nICBmcy53cml0ZUZpbGVTeW5jKERBVEFfRklMRSwgSlNPTi5zdHJpbmdpZnko\ndGFza3MsIG51bGwsIDIpKTsKfQoKLy8gR2V0IGFsbCB0YXNrcwphcHAuZ2V0\nKCcvdGFza3MnLCAocmVxLCByZXMpID0+IHsKICAgIGNvbnN0IHRhc2tzID0g\ncmVhZFRhc2tzKCk7CiAgICByZXMuanNvbih0YXNrcyk7Cn0pOwoKLy8gQWRk\nIGEgbmV3IHRhc2sKYXBwLnBvc3QoJy90YXNrcycsIChyZXEsIHJlcykgPT4g\newogICAgY29uc3QgdGFza3MgPSByZWFkVGFza3MoKTsKICAgIGNvbnN0IG5l\nd1Rhc2sgPSB7CiAgICAgICAgaWQ6IERhdGUubm93KCksCiAgICAgICAgdGl0\nbGU6IHJlcS5ib2R5LnRpdGxlLAogICAgICAgIGNvbXBsZXRlZDogZmFsc2UK\nICAgIH07CiAgICB0YXNrcy5wdXNoKG5ld1Rhc2spOwogICAgd3JpdGVUYXNr\ncyh0YXNrcyk7CiAgICByZXMuc3RhdHVzKDIwMSkuanNvbihuZXdUYXNrKTsK\nfSk7CgovLyBVcGRhdGUgYSB0YXNrCmFwcC5wdXQoJy90YXNrcy86aWQnLCAo\ncmVxLCByZXMpID0+IHsKICAgIGNvbnN0IHRhc2tzID0gcmVhZFRhc2tzKCk7\nCiAgICBjb25zdCB0YXNrSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmlkKTsK\nICAgIGNvbnN0IHRhc2tJbmRleCA9IHRhc2tzLmZpbmRJbmRleCh0YXNrID0+\nIHRhc2suaWQgPT09IHRhc2tJZCk7CgogICAgaWYgKHRhc2tJbmRleCA9PT0g\nLTEpIHsKICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBl\ncnJvcjogJ1Rhc2sgbm90IGZvdW5kJyB9KTsKICAgIH0KCiAgICB0YXNrc1t0\nYXNrSW5kZXhdID0gewogICAgICAgIC4uLnRhc2tzW3Rhc2tJbmRleF0sCiAg\nICAgICAgLi4ucmVxLmJvZHkKICAgIH07CiAgICB3cml0ZVRhc2tzKHRhc2tz\nKTsKICAgIHJlcy5qc29uKHRhc2tzW3Rhc2tJbmRleF0pOwp9KTsKCi8vIERl\nbGV0ZSBhIHRhc2sKYXBwLmRlbGV0ZSgnL3Rhc2tzLzppZCcsIChyZXEsIHJl\ncykgPT4gewogICAgY29uc3QgdGFza3MgPSByZWFkVGFza3MoKTsKICAgIGNv\nbnN0IHRhc2tJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuaWQpOwogICAgY29u\nc3QgZmlsdGVyZWRUYXNrcyA9IHRhc2tzLmZpbHRlcih0YXNrID0+IHRhc2su\naWQgIT09IHRhc2tJZCk7CgogICAgaWYgKHRhc2tzLmxlbmd0aCA9PT0gZmls\ndGVyZWRUYXNrcy5sZW5ndGgpIHsKICAgICAgICByZXR1cm4gcmVzLnN0YXR1\ncyg0MDQpLmpzb24oeyBlcnJvcjogJ1Rhc2sgbm90IGZvdW5kJyB9KTsKICAg\nIH0KCiAgICB3cml0ZVRhc2tzKGZpbHRlcmVkVGFza3MpOwogICAgcmVzLnN0\nYXR1cygyMDQpLnNlbmQoKTsKfSk7CgovLyBTdGFydCB0aGUgc2VydmVyCmFw\ncC5saXN0ZW4oUE9SVCwgKCkgPT4gewogICAgY29uc29sZS5sb2coYFNlcnZl\nciBpcyBydW5uaW5nIG9uICR7UE9SVH1gKTsKfSk7Cg==\n",
        },
      ],
    };

    for (const file of langflowResponse.repoFiles) {
      await createOrUpdateFile(
        payload.repository.full_name,
        file.path,
        file.content,
        `Adding test file: ${file.name}`,
        newBranch
      );
    }

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

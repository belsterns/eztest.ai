import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const GITHUB_API_BASE_URL = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Add your GitHub token in .env file

// Recursive function to fetch repository file structure
async function fetchRepoFiles(repoFullName: any, branchName: any, directory = ''): Promise<any> {
  const files = [];
  try {
    // Fetch files in the specified directory
    const response = await axios.get(
      `${GITHUB_API_BASE_URL}/repos/${repoFullName}/contents/${directory}?ref=${branchName}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    for (const item of response.data) {
      if (item.type === 'file') {
        files.push({ name: item.name, path: item.path, type: item.type });
      } else if (item.type === 'dir') {
        // If it's a directory, fetch its contents recursively
        const subFiles = await fetchRepoFiles(repoFullName, branchName, item.path);
        files.push(...subFiles);
      }
    }
  } catch (error: any) {
    console.error('Error fetching repository files:', error.message);
  }
  return files;
}

export async function POST(req: NextRequest) {
  try {
    // Parse the GitHub webhook payload
    const payload = await req.json();

    const branchRef = payload.ref; // Get the branch ref (e.g., refs/heads/main)
    const repoFullName = payload.repository.full_name; // Get the repository full name (e.g., owner/repo)

    // Validate that the webhook event contains a branch reference
    if (!branchRef || !branchRef.startsWith('refs/heads/')) {
      return NextResponse.json(
        { message: 'Not a branch commit or invalid event type' },
        { status: 400 }
      );
    }

    // Extract the branch name (e.g., "main" from "refs/heads/main")
    const baseBranch = branchRef.replace('refs/heads/', '');

    // Skip processing if the branch is already a "unitTest" branch
    if (baseBranch.endsWith('_unitTest')) {
      console.log('Skipping webhook for unit test branch:', baseBranch);
      return NextResponse.json(
        { message: 'Skipping webhook for unit test branch' },
        { status: 200 }
      );
    }

    // Define the new branch name
    const suffix = '_unitTest';
    const newBranch = `${baseBranch}${suffix}`;

    // Fetch the latest commit SHA for the base branch
    const branchResponse = await axios.get(
      `${GITHUB_API_BASE_URL}/repos/${repoFullName}/git/ref/heads/${baseBranch}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    const latestCommitSHA = branchResponse.data.object.sha;

    // Fetch the commit object for the latest commit
    const commitResponse = await axios.get(
      `${GITHUB_API_BASE_URL}/repos/${repoFullName}/git/commits/${latestCommitSHA}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    const parentCommitSHA = commitResponse.data.parents?.[0]?.sha;
    if (!parentCommitSHA) {
      console.error('No parent commit found for the latest commit.');
      return NextResponse.json(
        { message: 'No parent commit found for the latest commit' },
        { status: 400 }
      );
    }

    // Compare the latest commit with its parent to get changed files
    const compareResponse = await axios.get(
      `${GITHUB_API_BASE_URL}/repos/${repoFullName}/compare/${parentCommitSHA}...${latestCommitSHA}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    const changedFiles = compareResponse.data.files.map((file: any) => ({
      filename: file.filename,
      status: file.status, // e.g., 'added', 'modified', 'removed'
      changes: file.changes,
    }));

    console.log('Changed Files:', changedFiles);

    // Create the new branch
    await axios.post(
      `${GITHUB_API_BASE_URL}/repos/${repoFullName}/git/refs`,
      {
        ref: `refs/heads/${newBranch}`,
        sha: latestCommitSHA,
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'X-Triggered-By': 'MyApp', // Custom header to identify self-triggered events
        },
      }
    );

    console.log(`Branch '${newBranch}' created successfully.`);

    // Fetch the complete repository file structure recursively
    const repoFiles = await fetchRepoFiles(repoFullName, newBranch);

    console.log('Response:', {
      message: `Branch '${newBranch}' created successfully.`,
      changedFiles, // Return the list of changed files
      repoFiles, // Return the repository file structure
    });

    return NextResponse.json(
      {
        message: `Branch '${newBranch}' created successfully.`,
        changedFiles, // Return the list of changed files
        repoFiles, // Return the repository file structure
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error processing webhook:', error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Failed to process webhook', error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}

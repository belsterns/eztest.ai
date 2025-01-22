import { NextResponse } from "next/server";
import { Octokit } from "octokit";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const octokit = new Octokit({ auth: GITHUB_TOKEN });

// Function to parse the raw request body
async function getRawBody(req: Request): Promise<string> {
  const buffer = await req.arrayBuffer();
  return Buffer.from(buffer).toString("utf-8");
}

export const POST = async (req: Request) => {
  try {
    const rawBody = await getRawBody(req);
    const payload = JSON.parse(rawBody);

    const { repository, ref } = payload;

    if (!repository || !ref) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    const owner = repository.owner.login;
    const repo = repository.name;
    const sourceBranch = ref.replace("refs/heads/", ""); // Extract branch name (e.g., "main")
    const newBranchName = `${sourceBranch}_unitTest`;

    // Fetch the latest commit SHA of the source branch
    const branchInfo = await octokit.rest.repos.getBranch({
      owner,
      repo,
      branch: sourceBranch,
    });
    const commitSha = branchInfo.data.commit.sha;

    // Create the new branch
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${newBranchName}`,
      sha: commitSha,
    });

    return NextResponse.json({
      message: `New branch '${newBranchName}' created from '${sourceBranch}'`,
    });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
};

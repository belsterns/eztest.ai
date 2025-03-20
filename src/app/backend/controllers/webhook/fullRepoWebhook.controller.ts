import { NextResponse } from "next/server";
import { fetchProvider } from "../../utils/fetchProvider";

export class FullRepoWebhookController {
  async handleFullRepoTestInitialization(
    userUuid: string,
    repoUuid: string,
    body: any
  ) {
    try {
      const {
        provider,
        orgName: organization_name,
        repoName: repo_name,
      } = await fetchProvider(body);

      const repoFullName = `${organization_name}/${repo_name}`;
      const baseBranch = body.baseBranch || "main";

      if (!repoFullName) {
        return NextResponse.json(
          { message: "Repository name is required" },
          { status: 400 }
        );
      }

      return await provider.processFullRepo(
        userUuid,
        repoUuid,
        repoFullName,
        baseBranch
      );
    } catch (error: any) {
      console.error("Error processing full repository:", error.message);
      return NextResponse.json(
        {
          message: "Failed to process full repository",
          error: error.message,
        },
        { status: 500 }
      );
    }
  }
}

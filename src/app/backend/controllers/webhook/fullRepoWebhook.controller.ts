import { NextResponse } from "next/server";
import { FullRepoWebhookService } from "@/app/backend/services/webhook/fullRepoWebhook.service";
import { parseRepoUrl } from "@/app/backend/utils/parseUrl";

export class FullRepoWebhookController {
  private fullRepoService: FullRepoWebhookService;

  constructor() {
    this.fullRepoService = new FullRepoWebhookService();
  }

  async handleFullRepoTestInitialization(
    userUuid: string,
    repoUuid: string,
    body: any,
    repoToken: string
  ) {
    try {
      const { repo_url } = body;

      const { orgName: organization_name, repoName: repo_name } =
        parseRepoUrl(repo_url);

      const repoFullName = `${organization_name}/${repo_name}`;
      const baseBranch = body.baseBranch || "main";

      if (!repoFullName) {
        return NextResponse.json(
          { message: "Repository name is required" },
          { status: 400 }
        );
      }

      const response = await this.fullRepoService.processFullRepo(
        userUuid,
        repoUuid,
        repoFullName,
        baseBranch,
        repoToken
      );

      return NextResponse.json(response, { status: 201 });
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

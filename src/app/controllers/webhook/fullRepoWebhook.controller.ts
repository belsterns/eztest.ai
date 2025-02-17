import { NextRequest, NextResponse } from "next/server";
import { FullRepoWebhookService } from "@/app/services/webhook/fullRepoWebhook.service";
import { parseRepoUrl } from "@/app/utils/parseUrl";
import { StaticMessage } from "@/app/constants/StaticMessages";

export class FullRepoWebhookController {
  private fullRepoService: FullRepoWebhookService;

  constructor() {
    this.fullRepoService = new FullRepoWebhookService();
  }

  async handleFullRepoTestInitialization(req: NextRequest, context: any) {
    try {
      const headers = req.headers;
      const repoToken = headers.get("x-origin-token");

      if (!repoToken) {
        return NextResponse.json(
          { message: StaticMessage.InvalidGitHubToken },
          { status: 401 },
        );
      }

      const payload = await req.json();
      const { repo_url } = payload;
      const {
        orgName: organization_name,
        repoName: repo_name,
      } = parseRepoUrl(repo_url);

      const { nocobase_id:nocobaseId } = await context.params;
      const repoFullName = `${organization_name}/${repo_name}`;
      const baseBranch = payload.baseBranch || "main";

      if (!repoFullName) {
        return NextResponse.json(
          { message: "Repository name is required" },
          { status: 400 },
        );
      }

      const response = await this.fullRepoService.processFullRepo(
        repoFullName,
        baseBranch,
        nocobaseId,
        repoToken,
      );

      return NextResponse.json(response, { status: 201 });
    } catch (error: any) {
      console.error("Error processing full repository:", error.message);
      return NextResponse.json(
        {
          message: "Failed to process full repository",
          error: error.message,
        },
        { status: 500 },
      );
    }
  }
}

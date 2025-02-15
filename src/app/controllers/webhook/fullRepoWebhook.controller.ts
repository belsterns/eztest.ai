import { NextRequest, NextResponse } from "next/server";
import { FullRepoWebhookService } from "@/app/services/webhook/fullRepoWebhook.service";

export class FullRepoWebhookController {
  private fullRepoService: FullRepoWebhookService;

  constructor() {
    this.fullRepoService = new FullRepoWebhookService();
  }

  async handleFullRepoTestInitialization(req: NextRequest, context: any) {
    try {
      const payload = await req.json();
      const nocobaseId = context.params.nocobase_id;
      const repoFullName = payload.repoFullName;
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

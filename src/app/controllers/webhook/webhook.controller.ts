import { NextRequest, NextResponse } from "next/server";
import { WebhookService } from "@/app/services/webhook/webhook.service";

export class WebhookController {
  private webhookService: WebhookService;

  constructor() {
    this.webhookService = new WebhookService();
  }

  async handleGitHubWebhook(req: NextRequest) {
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

      const response = await this.webhookService.processWebhook(
        repoFullName,
        baseBranch
      );

      return NextResponse.json(response, { status: 201 });
    } catch (error: any) {
      console.error(
        "Error processing webhook:",
        error.response?.data || error.message
      );
      return NextResponse.json(
        {
          message: "Failed to process webhook",
          error: error.message,
        },
        { status: 500 }
      );
    }
  }
}

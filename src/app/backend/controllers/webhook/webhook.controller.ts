import { NextResponse } from "next/server";
import { WebhookService } from "@/app/backend/services/webhook/webhook.service";
import { GitWebhookHandlerFactory } from "@/app/backend/infrastructure/factory/handler/GitWebhookHandlerFactory";

export class WebhookController {
  private webhookService: WebhookService;

  constructor() {
    this.webhookService = new WebhookService();
  }

  async handleWebhook(payload: any, webhookUuid: string) {
    try {
      const branchRef = payload.ref;

      // Use Factory to get the correct webhook handler (GitHub or GitLab)
      const webhookHandler = GitWebhookHandlerFactory.getHandler(payload);
      const repoFullName = webhookHandler.extractRepoName(payload);

      if (!branchRef || !branchRef.startsWith("refs/heads/")) {
        return NextResponse.json(
          { message: "Not a branch commit or invalid event type" },
          { status: 400 }
        );
      }

      const baseBranch = branchRef.replace("refs/heads/", "");

      if (baseBranch.endsWith("_unitTest")) {
        return NextResponse.json(
          { message: "Skipping webhook for unit test branch" },
          { status: 200 }
        );
      }

      const response = await this.webhookService.processWebhook(
        repoFullName,
        baseBranch,
        webhookUuid
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

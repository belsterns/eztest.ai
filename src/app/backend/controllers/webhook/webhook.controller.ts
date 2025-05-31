import { NextResponse } from "next/server";
import { WebhookService } from "@/app/backend/services/webhook/webhook.service";
import { GitWebhookHandlerFactory } from "@/app/backend/infrastructure/factory/handler/GitWebhookHandlerFactory";

export class WebhookController {
  private readonly webhookService = new WebhookService();

  async handleWebhook(payload: any, webhookUuid: string) {
    try {
      const ref = payload.ref;
      if (!ref?.startsWith("refs/heads/")) {
        return this.badRequest("Not a branch commit or invalid event type");
      }

      const branch = ref.replace("refs/heads/", "");
      if (branch.endsWith("_unitTest")) {
        return this.success("Skipping webhook for unit test branch");
      }

      const handler = GitWebhookHandlerFactory.getHandler(payload);
      const repoName = handler.extractRepoName(payload);

      const result = await this.webhookService.processWebhook(
        repoName,
        branch,
        webhookUuid
      );
      return NextResponse.json(result, { status: 201 });
    } catch (err: any) {
      console.error(
        "Error processing webhook:",
        err.response?.data || err.message
      );
      return this.serverError("Failed to process webhook", err.message);
    }
  }

  private badRequest(message: string) {
    return NextResponse.json({ message }, { status: 400 });
  }

  private success(message: string) {
    return NextResponse.json({ message }, { status: 200 });
  }

  private serverError(message: string, error: string) {
    return NextResponse.json({ message, error }, { status: 500 });
  }
}

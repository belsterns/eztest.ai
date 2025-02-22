import { NextRequest } from "next/server";
import { WebhookController } from "@/app/backend/controllers/webhook/webhook.controller";

const webhookController = new WebhookController();

export async function POST(request: NextRequest, context: any) {
  const { webhook_uuid: webhookUuid } = await context.params;
  const payload = await request.json();
  return webhookController.handleGitHubWebhook(payload, webhookUuid);
}

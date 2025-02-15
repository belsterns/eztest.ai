import { NextRequest } from "next/server";
import { WebhookController } from "@/app/controllers/webhook/webhook.controller";

const webhookController = new WebhookController();

export async function POST(request: NextRequest, context: any) {
  const webhookUuid = context.params.webhook_uuid;
  const payload = await request.json();
  return webhookController.handleGitHubWebhook(payload, webhookUuid);
}

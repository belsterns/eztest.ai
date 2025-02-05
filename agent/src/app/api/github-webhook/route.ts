import { NextRequest } from "next/server";
import { WebhookController } from "@/app/controllers/webhook/webhook.controller";

const webhookController = new WebhookController();

export async function POST(req: NextRequest) {
  return webhookController.handleGitHubWebhook(req);
}

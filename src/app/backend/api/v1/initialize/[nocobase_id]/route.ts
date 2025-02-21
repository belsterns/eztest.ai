import { NextRequest } from "next/server";
import { FullRepoWebhookController } from "@/app/backend/controllers/webhook/fullRepoWebhook.controller";

export async function POST(req: NextRequest, context: any) {
  const controller = new FullRepoWebhookController();
  return await controller.handleFullRepoTestInitialization(req, context);
}

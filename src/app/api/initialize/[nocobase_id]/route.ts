import { NextRequest } from "next/server";
import { FullRepoWebhookController } from "@/app/controllers/webhook/fullRepoWebhook.controller";

export async function POST(req: NextRequest, context: any) {
  const controller = new FullRepoWebhookController();
  return await controller.handleFullRepoTestInitialization(req, context);
}

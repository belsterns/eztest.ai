import { NextRequest, NextResponse } from "next/server";
import { FullRepoWebhookController } from "@/app/backend/controllers/webhook/fullRepoWebhook.controller";
import { authenticateUser } from "@/app/backend/utils/user.auth";

const controller = new FullRepoWebhookController();

export async function POST(request: NextRequest, context: any) {
  const { userUuid } = await authenticateUser(request);

  const body = await request.json();

  const { repo_uuid: repoUuid } = await context.params;

  const response = await controller.handleFullRepoTestInitialization(
    userUuid,
    repoUuid,
    body
  );
  return NextResponse.json(response, { status: 200 });
}

import { NextRequest, NextResponse } from "next/server";
import { FullRepoWebhookController } from "@/app/backend/controllers/webhook/fullRepoWebhook.controller";
import { authenticateUser } from "@/app/backend/utils/user.auth";
import { StaticMessage } from "@/app/backend/constants/StaticMessages";

const controller = new FullRepoWebhookController();

export async function POST(request: NextRequest, context: any) {
  const { userUuid } = await authenticateUser(request);

  const headers = request.headers;

  const repoToken = headers.get("x-origin-token");
  const body = await request.json();

  if (!repoToken) {
    return NextResponse.json(
      { message: StaticMessage.InvalidGitHubToken },
      { status: 401 }
    );
  }

  const repoUuid = context.params.repo_uuid;

  return await controller.handleFullRepoTestInitialization(
    userUuid,
    repoUuid,
    body,
    repoToken
  );
}

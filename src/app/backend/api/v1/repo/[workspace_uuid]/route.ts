import { handleError } from "@/app/backend/utils/errorHandler";
import { authenticateUser } from "@/app/backend/utils/user.auth";
import { RepositoryController } from "@/app/backend/controllers/repositories/repository.controller";
import { NextRequest, NextResponse } from "next/server";

const repositoryController = new RepositoryController();

export async function GET(request: NextRequest, context: any) {
  try {
    const { workspace_uuid: workspaceUuid } = await context.params;

    if (!workspaceUuid) {
      throw { statusCode: 400, message: "workspaceUuid or repoUuid required" };
    }

    const { userUuid } = await authenticateUser(request);

    const response =
      await repositoryController.getRepositoryByUserAndWorkspaceUuid(
        userUuid,
        workspaceUuid
      );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

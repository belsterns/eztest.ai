import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/app/backend/utils/errorHandler";
import { authenticateUser } from "@/app/backend/utils/user.auth";
import { RepositoryController } from "@/app/backend/controllers/repositories/repository.controller";

const repositoryController = new RepositoryController();

export async function GET(request: NextRequest, context: any) {
  try {
    const workspaceUuid = context.params.workspace_uuid;

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

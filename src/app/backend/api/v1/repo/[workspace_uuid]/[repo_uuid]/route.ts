import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/app/backend/utils/errorHandler";
import { authenticateUser } from "@/app/backend/utils/user.auth";
import { RepositoryController } from "@/app/backend/controllers/repositories/repository.controller";
import { StaticMessage } from "@/app/backend/constants/StaticMessages";

const repositoryController = new RepositoryController();

export async function GET(request: NextRequest, context: any) {
  try {
    const workspaceUuid = context.params.workspace_uuid;
    const repoUuid = context.params.repo_uuid;

    if (!workspaceUuid || !repoUuid) {
      throw { statusCode: 400, message: "workspaceUuid or repoUuid required" };
    }

    const { userUuid } = await authenticateUser(request);

    const response = await repositoryController.getRepository(
      userUuid,
      workspaceUuid,
      repoUuid
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest, context: any) {
  try {
    const workspaceUuid = context.params.workspace_uuid;
    const repoUuid = context.params.repo_uuid;

    if (!workspaceUuid || !repoUuid) {
      throw {
        statusCode: 400,
        message: "workspaceUuid or repoUuid required",
      };
    }

    const { userUuid } = await authenticateUser(request);
    const body = await request.json();

    const headers = request.headers;
    const repoToken = headers.get("x-origin-token");

    if (!repoToken) {
      return NextResponse.json(
        { message: StaticMessage.InvalidGitHubToken },
        { status: 401 }
      );
    }

    const response = await repositoryController.updateRepositoryDetails(
      userUuid,
      workspaceUuid,
      repoUuid,
      body,
      repoToken
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const workspaceUuid = context.params.workspace_uuid;
    const repoUuid = context.params.repo_uuid;

    if (!workspaceUuid || !repoUuid) {
      throw {
        statusCode: 400,
        message: "workspaceUuid or repoUuid required",
      };
    }

    const { userUuid } = await authenticateUser(request);

    const response = await repositoryController.deleteRepository(
      userUuid,
      workspaceUuid,
      repoUuid
    );
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

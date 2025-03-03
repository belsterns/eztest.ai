import { NextRequest, NextResponse } from "next/server";
import { WorkspaceController } from "@/app/backend/controllers/workspace/workspace.controller";
import { handleError } from "@/app/backend/utils/errorHandler";
import { authenticateUser } from "@/app/backend/utils/user.auth";

const workspaceController = new WorkspaceController();

export async function GET(request: NextRequest, context: any) {
  try {
    const workspaceUuid = context.params.workspace_uuid;
    const { userUuid } = await authenticateUser(request);
    const response = await workspaceController.getWorkspaceByUser(
      userUuid,
      workspaceUuid
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest, context: any) {
  try {
    const workspaceUuid = context.params.workspace_uuid;
    const { userUuid } = await authenticateUser(request);
    const body = await request.json();

    const response = await workspaceController.updateWorkspaceDetails(
      userUuid,
      workspaceUuid,
      body
    );
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const workspaceUuid = context.params.workspace_uuid;
    const { userUuid } = await authenticateUser(request);

    const response = await workspaceController.deleteWorkspace(
      userUuid,
      workspaceUuid
    );
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

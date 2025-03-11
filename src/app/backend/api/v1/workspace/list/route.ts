import { NextRequest, NextResponse } from "next/server";
import { WorkspaceController } from "@/app/backend/controllers/workspace/workspace.controller";
import { authenticateUser } from "@/app/backend/utils/user.auth";
import { handleError } from "@/app/backend/utils/errorHandler";

const workspaceController = new WorkspaceController();

export async function GET(request: NextRequest) {
  try {
    const { userUuid } = await authenticateUser(request);

    const response = await workspaceController.getAllUserWorkspaces(userUuid);

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return handleError(error);
  }
}

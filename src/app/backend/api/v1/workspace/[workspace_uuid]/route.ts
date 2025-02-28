import { NextRequest, NextResponse } from "next/server";
import { WorkspaceController } from "@/app/backend/controllers/workspace/workspace.controller";
import { getToken } from "next-auth/jwt";
import { UnauthorizedException } from "@/app/backend/utils/exceptions";
import { StaticMessage } from "@/app/backend/constants/StaticMessages";

const workspaceController = new WorkspaceController();

export async function GET(request: NextRequest, context: any) {
  const { workspace_uuid: workspaceUuid } = await context.params;

  const jwt: any = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const user = jwt?.user_info;

  const { uuid: userUuid, org_role_uuid: roleUuid } = user;

  if (!roleUuid && !user.is_active) {
    throw new UnauthorizedException(StaticMessage.NoAccess);
  }

  const response = workspaceController.getWorkspaceByUser(
    userUuid,
    workspaceUuid
  );

  return NextResponse.json(response, { status: 200 });
}

export async function PATCH(request: NextRequest, context: any) {
  const { workspace_uuid: workspaceUuid } = await context.params;

  const jwt: any = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const user = jwt?.user_info;
  const body = await request.json();

  const { uuid: userUuid, org_role_uuid: roleUuid } = user;

  if (!roleUuid && !user.is_active) {
    throw new UnauthorizedException(StaticMessage.NoAccess);
  }

  const response = workspaceController.updateWorkspaceDetails(
    userUuid,
    workspaceUuid,
    body
  );
  return NextResponse.json(response, { status: 200 });
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const { workspace_uuid: workspaceUuid } = await context.params;

    const jwt: any = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    const user = jwt?.user_info;

    const { uuid: userUuid, org_role_uuid: roleUuid } = user;

    if (!roleUuid && !user.is_active) {
      throw new UnauthorizedException(StaticMessage.NoAccess);
    }

    const response = await workspaceController.deleteWorkspace(
      userUuid,
      workspaceUuid
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    throw error;
  }
}

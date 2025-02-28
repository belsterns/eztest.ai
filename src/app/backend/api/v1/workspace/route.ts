import { StaticMessage } from "@/app/backend/constants/StaticMessages";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { WorkspaceController } from "@/app/backend/controllers/workspace/workspace.controller";
import { UnauthorizedException } from "@/app/backend/utils/exceptions";

const workspaceController = new WorkspaceController();

export async function POST(request: NextRequest) {
  try {
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

    const response = await workspaceController.saveWorkspaceDetails(
      userUuid,
      body
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, data: error.data || null },
      { status: error.statusCode || 500 }
    );
  }
}


import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { UnauthorizedException } from "@/app/backend/utils/exceptions";
import { StaticMessage } from "@/app/backend/constants/StaticMessages";

export async function authenticateUser(request: NextRequest) {
  const jwt: any = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!jwt || !jwt.user_info) {
    throw new UnauthorizedException(StaticMessage.NoAccess);
  }

  const { uuid: userUuid, org_role_uuid: roleUuid, is_active } = jwt.user_info;

  if (!roleUuid && !is_active) {
    throw new UnauthorizedException(StaticMessage.NoAccess);
  }

  return { userUuid, roleUuid };
}

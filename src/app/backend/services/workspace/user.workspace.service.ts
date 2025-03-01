import prisma from "@/lib/prisma";

export class UserWorkspaceService {
  constructor() {}

  async saveUserWorkspace(userUuid: string, workspaceUuid: string) {
    try {
      return await prisma.user_workspaces.create({
        data: {
          user_uuid: userUuid,
          workspace_uuid: workspaceUuid,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

import prisma from "@/lib/prisma";
import { StaticMessage } from "@/app/backend/constants/StaticMessages";

export class RoleService {
  constructor() {}

  async fetchRoleByRoleName(roleName: string) {
    try {
      const role = await prisma.org_roles.findFirst({
        where: {
          name: { equals: roleName, mode: "insensitive" },
        },
        select: { uuid: true, name: true },
      });

      if (!role) {
        throw {
          statusCode: 404,
          message: StaticMessage.RoleNotFound,
          data: null,
        };
      }

      return role;
    } catch (error: any) {
      throw error;
    }
  }

  async fetchRoleByRoleUuid(roleUuid: string) {
    try {
      const role = await prisma.org_roles.findFirst({
        where: { uuid: roleUuid },
      });

      if (!role) {
        throw {
          statusCode: 404,
          message: StaticMessage.RoleNotFound,
          data: null,
        };
      }

      return role;
    } catch (error: any) {
      throw error;
    }
  }

  async fetchAllRoles() {
    try {
      return await prisma.org_roles.findMany({
        select: { uuid: true, name: true, description: true },
      });
    } catch (error) {
      throw error;
    }
  }
}

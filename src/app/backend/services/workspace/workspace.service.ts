import prisma from "@/lib/prisma";
import { StaticMessage } from "@/app/backend/constants/StaticMessages";
import {
  CreateWorkspaceRequestDto,
  UpdateWorkspaceRequestDto,
} from "../../infrastructure/dtos/WorkspaceRequestDto";
import { workspaces } from "@prisma/client";

export class WorkspaceService {
  async fetchWorkspaceByNameAndUserUuid(
    userUuid: string,
    workspaceName: string
  ) {
    try {
      const existingWorkspace = await prisma.workspaces.findFirst({
        where: {
          name: workspaceName,
          user_workspaces: { some: { user_uuid: userUuid } },
        },
      });

      if (existingWorkspace) {
        throw {
          statusCode: 409,
          message: StaticMessage.WorkspaceAlreadyExists,
        };
      }

      return existingWorkspace;
    } catch (error) {
      throw error;
    }
  }

  async fetchWorkspace(workspaceUuid: string) {
    try {
      const workspace = await prisma.workspaces.findUnique({
        where: { uuid: workspaceUuid },
      });

      if (!workspace) {
        throw { statusCode: 404, message: StaticMessage.WorkspaceNotFound };
      }

      return workspace;
    } catch (error) {
      throw error;
    }
  }

  async fetchAllUserWorkspaces(userUuid: string) {
    try {
      const userWorkspace = await prisma.user_workspaces.findMany({
        where: { user_uuid: userUuid },
        select: {
          workspace: true,
        },
      });

      if (!userWorkspace) {
        throw { statusCode: 404, message: StaticMessage.WorkspaceNotFound };
      }

      return userWorkspace;
    } catch (error) {
      throw error;
    }
  }

  async fetchUserWorkspace(userUuid: string, workspaceUuid: string) {
    try {
      const userWorkspace = await prisma.user_workspaces.findFirst({
        where: { user_uuid: userUuid, workspace_uuid: workspaceUuid },
        select: {
          workspace: true,
        },
      });

      if (!userWorkspace) {
        throw { statusCode: 404, message: StaticMessage.WorkspaceNotFound };
      }

      return userWorkspace;
    } catch (error) {
      throw error;
    }
  }

  async saveWorkspaceDetails(model: CreateWorkspaceRequestDto) {
    try {
      return prisma.workspaces.create({
        data: { name: model.name, description: model.description },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateWorkspace(
    workspaceUuid: string,
    model: UpdateWorkspaceRequestDto,
    existingWorkspace: workspaces
  ) {
    try {
      const { name, description } = model;

      return await prisma.workspaces.update({
        where: { uuid: workspaceUuid },
        data: {
          name: name ?? existingWorkspace.name,
          description: description ?? existingWorkspace.description,
          updated_at: new Date(),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteWorkspace(workspaceUuid: string) {
    try {
      return prisma.workspaces.delete({ where: { uuid: workspaceUuid } });
    } catch (error) {
      throw error;
    }
  }
}

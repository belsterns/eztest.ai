import prisma from "@/lib/prisma";
import { StaticMessage } from "@/app/backend/constants/StaticMessages";
import {
  CreateWorkspaceRequestDto,
  UpdateWorkspaceRequestDto,
} from "../../infrastructure/dtos/WorkspaceRequestDto";

export class WorkspaceService {
  constructor() {}

  async fetchWorkspaceByNameAndUserUuid(
    userUuid: string,
    workspaceName: string
  ) {
    try {
      const existingWorkspace = await prisma.workspaces.findFirst({
        where: {
          name: workspaceName,
          user_workspaces: {
            some: {
              user_uuid: userUuid,
            },
          },
        },
      });

      if (existingWorkspace) {
        throw {
          statusCode: 404,
          message: StaticMessage.WorkspaceAlreadyExists,
          data: null,
        };
      }

      return existingWorkspace;
    } catch (error: any) {
      throw error;
    }
  }

  async fetchWorkspaceByWorkspaceUuidAndUserUuid(
    userUuid: string,
    workspaceUuid: string
  ) {
    try {
      const existingWorkspace = await prisma.user_workspaces.findFirst({
        where: {
          user_uuid: userUuid,
          workspace_uuid: workspaceUuid,
        },
      });

      if (!existingWorkspace) {
        throw {
          statusCode: 404,
          message: StaticMessage.UserWorkspaceNotFound,
          data: null,
        };
      }

      return existingWorkspace;
    } catch (error: any) {
      throw error;
    }
  }

  async saveWorkspaceDetails(model: CreateWorkspaceRequestDto) {
    try {
      const { description, name } = model;

      return await prisma.workspaces.create({
        data: {
          description,
          name,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateWorkspace(
    workspaceUuid: string,
    model: UpdateWorkspaceRequestDto
  ) {
    try {
      const { name, description } = model;

      return await prisma.workspaces.update({
        data: {
          name,
          description,
          updated_at: new Date(),
        },
        where: { uuid: workspaceUuid },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteWorkspace(workspaceUuid: string) {
    try {
      return await prisma.workspaces.delete({
        where: {
          uuid: workspaceUuid,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

import { StaticMessage } from "@/app/backend/constants/StaticMessages";
import {
  CreateWorkspaceRequestDto,
  UpdateWorkspaceRequestDto,
} from "../../infrastructure/dtos/WorkspaceRequestDto";
import { WorkspaceValidator } from "../../validator/WorkspaceValidator";
import { WorkspaceService } from "../../services/workspace/workspace.service";
import { UserWorkspaceService } from "../../services/workspace/user.workspace.service";

export class WorkspaceController {
  private workspaceValidator: WorkspaceValidator;
  private workspaceService: WorkspaceService;
  private userWorkspaceService: UserWorkspaceService;

  constructor() {
    this.workspaceValidator = new WorkspaceValidator();
    this.workspaceService = new WorkspaceService();
    this.userWorkspaceService = new UserWorkspaceService();
  }

  async saveWorkspaceDetails(
    userUuid: string,
    body: CreateWorkspaceRequestDto
  ) {
    try {
      const { name } = body;

      await this.workspaceValidator.CreateWorkspace(body);

      await this.workspaceService.fetchWorkspaceByNameAndUserUuid(
        userUuid,
        name
      );

      const workspace = await this.workspaceService.saveWorkspaceDetails(body);

      await this.userWorkspaceService.saveUserWorkspace(
        userUuid,
        workspace.uuid
      );

      return {
        message: StaticMessage.WorkspaceCreatedSuccessfully,
        data: workspace,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async getAllUserWorkspaces(userUuid: string) {
    try {
      const isWorkspaceExist =
        await this.workspaceService.fetchAllUserWorkspaces(userUuid);

      return {
        message: StaticMessage.WorkspaceFetchedSuccessfully,
        data: isWorkspaceExist,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async getWorkspaceByUser(userUuid: string, workspaceUuid: string) {
    try {
      const isWorkspaceExist = await this.workspaceService.fetchUserWorkspace(
        userUuid,
        workspaceUuid
      );

      return {
        message: StaticMessage.WorkspaceFetchedSuccessfully,
        data: isWorkspaceExist.workspace,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async updateWorkspaceDetails(
    userUuid: string,
    workspaceUuid: string,
    body: UpdateWorkspaceRequestDto
  ) {
    try {
      const { name } = body;

      await this.workspaceValidator.UpdateWorkspace(body);

      const isWorkspaceExist = await this.workspaceService.fetchUserWorkspace(
        userUuid,
        workspaceUuid
      );

      if (name) {
        await this.workspaceService.fetchWorkspaceByNameAndUserUuid(
          userUuid,
          name
        );
      }

      const { workspace } = isWorkspaceExist;

      const updatedWorkspace = await this.workspaceService.updateWorkspace(
        workspace.uuid,
        body,
        workspace
      );

      return {
        message: StaticMessage.WorkspaceUpdatedSuccessfully,
        data: updatedWorkspace,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async deleteWorkspace(userUuid: string, workspaceUuid: string) {
    try {
      const {
        workspace: { uuid },
      } = await this.workspaceService.fetchUserWorkspace(
        userUuid,
        workspaceUuid
      );

      await this.workspaceService.deleteWorkspace(uuid);

      return {
        message: StaticMessage.WorkspaceDeletedSuccessfully,
        data: null,
      };
    } catch (error: any) {
      throw error;
    }
  }
}

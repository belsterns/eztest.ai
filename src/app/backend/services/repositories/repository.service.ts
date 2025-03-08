import { IRepoStrategy } from "@/app/backend/infrastructure/strategies/IRepoStrategy";
import { GitHubStrategy } from "@/app/backend/infrastructure/strategies/GitHubStrategy";
import { GitLabStrategy } from "@/app/backend/infrastructure/strategies/GitLabStrategy";
import { BitbucketStrategy } from "@/app/backend/infrastructure/strategies/BitbucketStrategy";
import { GiteaStrategy } from "@/app/backend/infrastructure/strategies/GiteaStrategy";
import prisma from "@/lib/prisma";
import { StaticMessage } from "@/app/backend/constants/StaticMessages";
import { encryptToken } from "@/app/backend/utils/cryptoUtils";
import { NotFoundException } from "../../utils/exceptions";

export class RepositoryService {
  private strategyMap: Map<string, IRepoStrategy>;

  constructor() {
    this.strategyMap = new Map<string, IRepoStrategy>([
      ["github", new GitHubStrategy()],
      ["gitlab", new GitLabStrategy()],
      ["bitbucket", new BitbucketStrategy()],
      ["gitea", new GiteaStrategy()],
    ]);
  }

  getStrategy(remoteOrigin: string): IRepoStrategy {
    const strategy = this.strategyMap.get(remoteOrigin.toLowerCase());
    if (!strategy)
      throw new NotFoundException(`Unsupported remote origin: ${remoteOrigin}`);
    return strategy;
  }

  async verifyOwnership(
    userUuid: string,
    workspaceUuid: string,
    repoUuid: string
  ) {
    const repo = await prisma.repositories.findFirst({
      where: {
        uuid: repoUuid,
        user_uuid: userUuid,
        workspace_uuid: workspaceUuid,
      },
    });

    if (!repo) {
      throw {
        statusCode: 404,
        message: StaticMessage.RepositoryNotFound,
        data: null,
      };
    }

    return repo;
  }

  async fetchRepoDetailsByName(
    userUuid: string,
    orgName: string,
    repoName: string
  ) {
    try {
      const existingRepo = await prisma.repositories.findFirst({
        where: {
          user_uuid: userUuid,
          organization_name: orgName,
          repo_name: repoName,
        },
      });

      if (existingRepo) {
        throw {
          statusCode: 400,
          message: StaticMessage.RepoAlreadyExists,
          data: null,
        };
      }
    } catch (error: any) {
      throw error;
    }
  }

  async fetchRepoDetailsByUserAndWorkspaceUuid(
    userUuid: string,
    workspaceUuid: string
  ) {
    return prisma.repositories.findMany({
      where: { user_uuid: userUuid, workspace_uuid: workspaceUuid },
      select: {
        uuid: true,
        user_uuid: true,
        host_url: true,
        webhook_uuid: true,
        remote_origin: true,
        repo_url: true,
        organization_name: true,
        repo_name: true,
        is_active: true,
        is_initialized: true,
        created_at: true,
        updated_at: true,
        workspace: true,
      },
    });
  }

  async fetchRepoDetails(
    userUuid: string,
    workspaceUuid: string,
    repoUuid: string
  ) {
    return this.verifyOwnership(userUuid, workspaceUuid, repoUuid);
  }

  async saveRepositoryDetails(model: any) {
    try {
      const encryptedToken = encryptToken(model.token);
      return await prisma.repositories.create({
        data: { ...model, token: encryptedToken },
      });
    } catch (error) {
      console.error("Error in saveRepositoryDetails:", error);
      throw error;
    }
  }

  async updateRepositoryDetails(repoUuid: string, model: any) {
    try {
      const encryptedToken = encryptToken(model.token);

      return await prisma.repositories.update({
        data: { ...model, token: encryptedToken, updated_at: new Date() },
        where: { uuid: repoUuid },
        select: {
          uuid: true,
          user_uuid: true,
          host_url: true,
          webhook_uuid: true,
          remote_origin: true,
          repo_url: true,
          organization_name: true,
          repo_name: true,
          is_active: true,
          is_initialized: true,
          created_at: true,
          updated_at: true,
          workspace: true,
        },
      });
    } catch (error) {
      console.error("Error in updateRepositoryDetails:", error);
      throw error;
    }
  }

  async deleteRepository(repoUuid: string) {
    try {
      return await prisma.repositories.delete({ where: { uuid: repoUuid } });
    } catch (error) {
      console.error("Error in deleteRepository:", error);
      throw error;
    }
  }
}

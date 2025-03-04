import { IRepoStrategy } from "@/app/backend/infrastructure/strategies/IRepoStrategy";
import { GitHubStrategy } from "@/app/backend/infrastructure/strategies/GitHubStrategy";
import { GitLabStrategy } from "@/app/backend/infrastructure/strategies/GitLabStrategy";
import { BitbucketStrategy } from "@/app/backend/infrastructure/strategies/BitbucketStrategy";
import { GiteaStrategy } from "@/app/backend/infrastructure/strategies/GiteaStrategy";
import prisma from "@/lib/prisma";
import { StaticMessage } from "@/app/backend/constants/StaticMessages";
import { encryptToken } from "@/app/backend/utils/cryptoUtils";

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
    if (!strategy) {
      throw new Error(`Unsupported remote origin: ${remoteOrigin}`);
    }
    return strategy;
  }

  async fetchRepoDetailsByName(orgName: string, repoName: string) {
    try {
      const existingRepo = await prisma.repositories.findFirst({
        where: {
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
    try {
      const existingRepo = await prisma.repositories.findMany({
        where: {
          user_uuid: userUuid,
          workspace_uuid: workspaceUuid,
        },
      });

      if (!existingRepo) {
        throw {
          statusCode: 404,
          message: StaticMessage.RepositoryNotFound,
          data: null,
        };
      }

      return existingRepo[0];
    } catch (error: any) {
      throw error;
    }
  }

  async saveRepositoryDetails(model: any) {
    try {
      const {
        user_uuid,
        workspace_uuid,
        host_url,
        organization_name,
        remote_origin,
        repo_name,
        token,
        webhook_uuid,
      } = model;
      const encryptedToken = encryptToken(token);

      return await prisma.repositories.create({
        data: {
          user_uuid,
          workspace_uuid,
          host_url,
          webhook_uuid,
          remote_origin,
          repo_name,
          token: encryptedToken,
          organization_name,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateRepositoryDetails(repoUuid: string, model: any) {
    try {
      const {
        host_url,
        organization_name,
        remote_origin,
        repo_name,
        token,
        webhook_uuid,
      } = model;
      const encryptedToken = encryptToken(token);

      return await prisma.repositories.update({
        data: {
          host_url,
          webhook_uuid,
          remote_origin,
          repo_name,
          token: encryptedToken,
          organization_name,
          updated_at: new Date(),
        },
        where: { uuid: repoUuid },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteRepository(repoUuid: string) {
    try {
      return await prisma.repositories.delete({
        where: {
          uuid: repoUuid,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

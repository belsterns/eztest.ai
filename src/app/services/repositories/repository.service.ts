import { IRepoStrategy } from "@/app/infrastructure/strategies/IRepoStrategy";
import { GitHubStrategy } from "@/app/infrastructure/strategies/GitHubStrategy";
import { GitLabStrategy } from "@/app/infrastructure/strategies/GitLabStrategy";
import { BitbucketStrategy } from "@/app/infrastructure/strategies/BitbucketStrategy";
import { GiteaStrategy } from "@/app/infrastructure/strategies/GiteaStrategy";
import prisma from "@/lib/prisma";
import { StaticMessage } from "@/app/constants/StaticMessages";
import { decryptToken, encryptToken } from "@/app/utils/cryptoUtils";

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

  async saveRepositoryDetails(model: any) {
    try {
      const {
        host_url,
        nocobase_id,
        organization_name,
        remote_origin,
        repo_name,
        token,
        webhook_url,
      } = model;
      const encryptedToken = encryptToken(token);

      return await prisma.repositories.create({
        data: {
          nocobase_id,
          host_url,
          webhook_url,
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
}

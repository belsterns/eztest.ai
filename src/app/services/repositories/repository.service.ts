import { IRepoStrategy } from "@/app/infrastructure/strategies/IRepoStrategy";
import { GitHubStrategy } from "@/app/infrastructure/strategies/GitHubStrategy";
import { GitLabStrategy } from "@/app/infrastructure/strategies/GitLabStrategy";
import { BitbucketStrategy } from "@/app/infrastructure/strategies/BitbucketStrategy";
import { GiteaStrategy } from "@/app/infrastructure/strategies/GiteaStrategy";
import prisma from "@/lib/prisma";
import { StaticMessage } from "@/app/constants/StaticMessages";

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
      const existingRepo = await prisma.repository.findFirst({
        where: {
          organization_name: orgName,
          repo_name: repoName,
        },
      });

      if (existingRepo) {
        throw new Error(StaticMessage.RepoAlreadyExists);
      }
    } catch (error: any) {
      throw new Error(
        error.message || "An error occurred while fetching repository details."
      );
    }
  }

  async saveRepositoryDetails(model: any) {
    try {
      return await prisma.repository.create({
        data: {
          nocobase_id: model.nocobase_id,
          host_url: model.host_url,
          webhook_url: model.webhook_url,
          remote_origin: model.remote_origin,
          repo_name: model.repo_name,
          token: model.token,
          organization_name: model.organization_name,
        },
      });
    } catch (error) {
      throw new Error(StaticMessage.RepoSaveFailed);
    }
  }
}

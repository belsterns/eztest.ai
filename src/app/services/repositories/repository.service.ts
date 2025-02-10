import { IRepoStrategy } from "@/app/infrastructure/strategies/IRepoStrategy";
import { GitHubStrategy } from "@/app/infrastructure/strategies/GitHubStrategy";
import { GitLabStrategy } from "@/app/infrastructure/strategies/GitLabStrategy";
import { BitbucketStrategy } from "@/app/infrastructure/strategies/BitbucketStrategy";
import { GiteaStrategy } from "@/app/infrastructure/strategies/GiteaStrategy";

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
}

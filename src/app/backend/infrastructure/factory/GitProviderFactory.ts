import { GiteaProvider } from "./GiteaProvider";
import { GitHubProvider } from "./GitHubProvider";
import { GitLabProvider } from "./GitLabProvider";
import { GitProvider } from "./GitProvider";

export class GitProviderFactory {
  static getProvider(hostUrl: string, repoToken: string): GitProvider {
    if (hostUrl.includes("github.com")) {
      return new GitHubProvider(hostUrl, repoToken);
    } else if (hostUrl.includes("gitlab.com")) {
      return new GitLabProvider(hostUrl, repoToken);
    } else if (hostUrl.includes("git.")) {
      return new GiteaProvider(hostUrl, repoToken);
    } else {
      throw new Error("Unsupported Git provider");
    }
  }
}

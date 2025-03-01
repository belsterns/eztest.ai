import { GitHubProvider } from "./GitHubProvider";
import { GitLabProvider } from "./GitLabProvider";
import { GitProvider } from "./GitProvider";

export class GitProviderFactory {
  static getProvider(hostUrl: string, repoToken: string): GitProvider {
    if (hostUrl.includes("github.com")) {
      return new GitHubProvider("https://api.github.com", repoToken);
    } else if (hostUrl.includes("gitlab.com")) {
      return new GitLabProvider("https://gitlab.com/api/v4", repoToken);
    } else {
      throw new Error("Unsupported Git provider");
    }
  }
}

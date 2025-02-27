import { GitWebhookHandler } from "./GitWebhookHandler";

export class GitLabWebhookHandler implements GitWebhookHandler {
  extractRepoName(payload: any): string {
    if (!payload.repository || !payload.repository.url) {
      throw new Error(
        "Invalid GitLab webhook payload: Repository URL is missing."
      );
    }

    return payload.repository.url
      .replace(/^git@gitlab.com:/, "")
      .replace(/\.git$/, "");
  }
}

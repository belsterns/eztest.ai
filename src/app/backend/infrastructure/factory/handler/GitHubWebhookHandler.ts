import { GitWebhookHandler } from "./GitWebhookHandler";

export class GitHubWebhookHandler implements GitWebhookHandler {
  extractRepoName(payload: any): string {
    if (!payload.repository || !payload.repository.full_name) {
      throw new Error(
        "Invalid GitHub webhook payload: Repository information is missing."
      );
    }
    return payload.repository.full_name;
  }
}

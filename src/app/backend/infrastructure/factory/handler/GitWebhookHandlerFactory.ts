import { GitWebhookHandler } from "./GitWebhookHandler";
import { GitHubWebhookHandler } from "./GitHubWebhookHandler";
import { GitLabWebhookHandler } from "./GitLabWebhookHandler";

export class GitWebhookHandlerFactory {
  static getHandler(payload: any): GitWebhookHandler {
    if (payload.repository?.full_name) {
      return new GitHubWebhookHandler();
    } else if (payload.repository?.url) {
      return new GitLabWebhookHandler();
    } else {
      throw new Error(
        "Unsupported webhook payload: Cannot determine Git provider."
      );
    }
  }
}

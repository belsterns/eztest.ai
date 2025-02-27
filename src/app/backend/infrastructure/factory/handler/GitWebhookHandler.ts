export interface GitWebhookHandler {
  extractRepoName(payload: any): string;
}

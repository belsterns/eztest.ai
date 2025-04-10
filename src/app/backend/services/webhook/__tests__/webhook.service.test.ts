import { WebhookService } from '../webhook.service';

describe('WebhookService', () => {
  let webhookService: WebhookService;

  beforeEach(() => {
    webhookService = new WebhookService();
  });

  it('should be defined', () => {
    expect(webhookService).toBeDefined();
  });

  // Add more tests for each method in the WebhookService
});
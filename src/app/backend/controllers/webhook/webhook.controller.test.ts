import { WebhookController } from './webhook.controller';

describe('WebhookController', () => {
  let controller: WebhookController;

  beforeEach(() => {
    controller = new WebhookController();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add more tests for the controller methods here
});
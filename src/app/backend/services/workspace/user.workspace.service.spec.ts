import { UserWorkspaceService } from './user.workspace.service';

describe('UserWorkspaceService', () => {
  let service: UserWorkspaceService;

  beforeEach(() => {
    service = new UserWorkspaceService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Add more tests for service methods here
});
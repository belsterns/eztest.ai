import { WorkspaceController } from '../workspace.controller';

describe('WorkspaceController', () => {
  let controller: WorkspaceController;

  beforeEach(() => {
    controller = new WorkspaceController();
  });

  it('should create a workspace', () => {
    const result = controller.createWorkspace({ name: 'Test Workspace' });
    expect(result).toHaveProperty('id');
    expect(result.name).toBe('Test Workspace');
  });

  it('should retrieve a workspace by id', () => {
    const workspace = controller.createWorkspace({ name: 'Test Workspace' });
    const result = controller.getWorkspaceById(workspace.id);
    expect(result).toEqual(workspace);
  });

  it('should update a workspace', () => {
    const workspace = controller.createWorkspace({ name: 'Test Workspace' });
    const updatedWorkspace = controller.updateWorkspace(workspace.id, { name: 'Updated Workspace' });
    expect(updatedWorkspace.name).toBe('Updated Workspace');
  });

  it('should delete a workspace', () => {
    const workspace = controller.createWorkspace({ name: 'Test Workspace' });
    controller.deleteWorkspace(workspace.id);
    expect(controller.getWorkspaceById(workspace.id)).toBeUndefined();
  });
});
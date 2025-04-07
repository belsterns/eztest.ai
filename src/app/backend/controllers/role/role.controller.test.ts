import { RoleController } from './role.controller';

describe('RoleController', () => {
  let roleController: RoleController;

  beforeEach(() => {
    roleController = new RoleController();
  });

  it('should create a new role', () => {
    const roleData = { name: 'Admin' };
    const result = roleController.createRole(roleData);
    expect(result).toEqual(expect.objectContaining(roleData));
  });

  it('should get a role by id', () => {
    const roleId = 1;
    const result = roleController.getRoleById(roleId);
    expect(result).toBeDefined();
  });

  it('should update a role', () => {
    const roleId = 1;
    const updatedData = { name: 'User' };
    const result = roleController.updateRole(roleId, updatedData);
    expect(result).toEqual(expect.objectContaining(updatedData));
  });

  it('should delete a role', () => {
    const roleId = 1;
    const result = roleController.deleteRole(roleId);
    expect(result).toBeTruthy();
  });
});
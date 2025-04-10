import { RoleController } from './role.controller';

describe('RoleController', () => {
  let roleController: RoleController;

  beforeEach(() => {
    roleController = new RoleController();
  });

  it('should create a role', () => {
    const roleData = { name: 'Admin' };
    const result = roleController.createRole(roleData);
    expect(result).toEqual({ id: expect.any(String), ...roleData });
  });

  it('should get a role by id', () => {
    const roleId = '1';
    const result = roleController.getRoleById(roleId);
    expect(result).toEqual({ id: roleId, name: 'Admin' });
  });

  it('should update a role', () => {
    const roleId = '1';
    const updateData = { name: 'User' };
    const result = roleController.updateRole(roleId, updateData);
    expect(result).toEqual({ id: roleId, ...updateData });
  });

  it('should delete a role', () => {
    const roleId = '1';
    const result = roleController.deleteRole(roleId);
    expect(result).toBe(true);
  });
});
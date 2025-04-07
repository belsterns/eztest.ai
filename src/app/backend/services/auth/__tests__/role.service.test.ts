import { RoleService } from '../role.service';

describe('RoleService', () => {
  let roleService: RoleService;

  beforeEach(() => {
    roleService = new RoleService();
  });

  it('should create an instance of RoleService', () => {
    expect(roleService).toBeTruthy();
  });

  it('should return roles correctly', () => {
    const roles = roleService.getRoles();
    expect(roles).toEqual(expect.any(Array));
  });

  it('should add a role correctly', () => {
    roleService.addRole('admin');
    const roles = roleService.getRoles();
    expect(roles).toContain('admin');
  });

  it('should remove a role correctly', () => {
    roleService.addRole('user');
    roleService.removeRole('user');
    const roles = roleService.getRoles();
    expect(roles).not.toContain('user');
  });
});
import { RoleService } from './role.service';

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(() => {
    service = new RoleService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return roles', () => {
    const roles = service.getRoles();
    expect(roles).toBeInstanceOf(Array);
  });

  it('should add a role', () => {
    service.addRole('admin');
    expect(service.getRoles()).toContain('admin');
  });

  it('should remove a role', () => {
    service.addRole('admin');
    service.removeRole('admin');
    expect(service.getRoles()).not.toContain('admin');
  });
});
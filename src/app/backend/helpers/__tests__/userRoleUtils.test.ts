import { getUserRole, isAdmin } from '../userRoleUtils';

describe('User Role Utils', () => {
  describe('getUserRole', () => {
    it('should return the correct role for a given user', () => {
      const user = { id: 1, role: 'admin' };
      expect(getUserRole(user)).toBe('admin');
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin users', () => {
      const user = { id: 1, role: 'admin' };
      expect(isAdmin(user)).toBe(true);
    });

    it('should return false for non-admin users', () => {
      const user = { id: 2, role: 'user' };
      expect(isAdmin(user)).toBe(false);
    });
  });
});
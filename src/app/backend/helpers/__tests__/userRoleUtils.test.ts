import { checkUserRole, assignUserRole } from '../userRoleUtils';

describe('User Role Utils', () => {
  describe('checkUserRole', () => {
    it('should return true for admin role', () => {
      expect(checkUserRole('admin')).toBe(true);
    });
    it('should return false for guest role', () => {
      expect(checkUserRole('guest')).toBe(false);
    });
  });

  describe('assignUserRole', () => {
    it('should assign the correct role', () => {
      const user = { name: 'John', role: '' };
      assignUserRole(user, 'editor');
      expect(user.role).toBe('editor');
    });
  });
});
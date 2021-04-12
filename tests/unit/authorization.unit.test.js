const { checkUserRole } = require('../../src/services/authorization.service');

describe('Authorization Unit Tests', () => {
  describe('Check User Role for permission', () => {
    test('should return false if a user does not have permission', async () => {
      await expect(checkUserRole('user', 'manageGroups')).resolves.toBeFalsy();
    });
    test('should return true if a user has permission', async () => {
      await expect(checkUserRole('admin', 'manageGroups')).resolves.toBeTruthy();
    });
    test('Should return false for nonexistent permission', async () => {
      await expect(checkUserRole('admin', '<non-existent>')).resolves.toBeFalsy();
    });
  });
});

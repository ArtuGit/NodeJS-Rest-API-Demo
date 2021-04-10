const faker = require('faker');
const { Group } = require('../../../src/models');

describe('Group model', () => {
  describe('Group validation', () => {
    let newGroup;
    beforeEach(() => {
      newGroup = {
        name: faker.lorem.words(3),
        description: faker.lorem.words(10),
        admin: '6069f8233f29402327faa747',
        private: false,
      };
    });

    test('should correctly validate a valid group', async () => {
      await expect(new Group(newGroup).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if admin is invalid', async () => {
      newGroup.admin = '123';
      await expect(new Group(newGroup).validate()).rejects.toThrow();
    });

    test('should throw a validation error if "private" is undefined', async () => {
      newGroup.private = undefined;
      await expect(new Group(newGroup).validate()).rejects.toThrow();
    });
  });
});

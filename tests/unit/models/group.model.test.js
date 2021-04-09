const faker = require('faker');
const { Group } = require('../../../src/models');

describe('Group model', () => {
  describe('Group validation', () => {
    let newGroup;
    beforeEach(() => {
      newGroup = {
        name: faker.name.findName(),
        description: faker.lorem.words(10),
        admin: '6069f8233f29402327faa747',
        private: false,
      };
    });

    test('should correctly validate a valid group', async () => {
      await expect(new Group(newGroup).validate()).resolves.toBeUndefined();
    });
  });
});

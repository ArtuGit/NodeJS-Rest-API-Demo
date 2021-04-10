const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Group } = require('../../src/models');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Group routes', () => {
  describe('POST /v1/group', () => {
    let newGroup;
    beforeEach(() => {
      newGroup = {
        name: faker.lorem.words(3),
        description: faker.lorem.words(10),
        private: false,
      };
    });

    test('should return 201 and successfully create new group by admin if data is ok', async () => {
      await insertUsers([admin]);
      const res = await request(app)
        .post('/v1/groups')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newGroup)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        name: newGroup.name,
        description: newGroup.description,
        admin: expect.anything(),
        private: newGroup.private,
        members: [],
      });

      const dbGroup = await Group.findById(res.body.id);
      expect(dbGroup).toBeDefined();
      expect(dbGroup).toMatchObject({
        name: newGroup.name,
        description: newGroup.description,
        admin: admin._id,
        private: newGroup.private,
      });
    });

    test('should return 201 and successfully create new group by user if data is ok', async () => {
      await insertUsers([userOne]);
      const res = await request(app)
        .post('/v1/groups')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newGroup)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        name: newGroup.name,
        description: newGroup.description,
        admin: expect.anything(),
        private: newGroup.private,
        members: [],
      });

      const dbGroup = await Group.findById(res.body.id);
      expect(dbGroup).toBeDefined();
      expect(dbGroup).toMatchObject({
        name: newGroup.name,
        description: newGroup.description,
        admin: userOne._id,
        private: newGroup.private,
      });
    });
  });
});

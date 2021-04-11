const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Group } = require('../../src/models');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { groupPublic1, groupPublic2, groupPrivate, insertGroups } = require('../fixtures/group.fixture');

setupTestDB();

describe('Group routes', () => {
  describe('POST /v1/groups', () => {
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

    test('should return 401 if Authorization is inappropriate', async () => {
      await insertUsers([userOne]);
      // eslint-disable-next-line no-unused-vars
      const res = await request(app)
        .post('/v1/groups')
        .set('Authorization', `Bearer !WRONG!`)
        .send(newGroup)
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /v1/groups', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertGroups([groupPublic1, groupPublic2, groupPrivate]);

      const res = await request(app).get('/v1/groups').send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0]).toEqual({
        id: groupPublic1._id.toHexString(),
        name: groupPublic1.name,
        description: groupPublic1.description,
        admin: userOne._id.toHexString(),
        members: [],
        private: groupPublic1.private,
      });
    });

    test('should correctly apply filter on name field', async () => {
      await insertGroups([groupPublic1, groupPublic2, groupPrivate]);

      const res = await request(app).get('/v1/groups').query({ name: groupPublic1.name }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0]).toEqual({
        id: groupPublic1._id.toHexString(),
        name: groupPublic1.name,
        description: groupPublic1.description,
        admin: userOne._id.toHexString(),
        members: [],
        private: groupPublic1.private,
      });
    });
  });
});

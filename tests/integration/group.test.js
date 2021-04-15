const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Group } = require('../../src/models');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, userTwoAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
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
      await request(app)
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

  describe('GET /v1/groups/:groupId', () => {
    test('should return 200 and the group object if data is ok', async () => {
      await insertUsers([userOne]);
      await insertGroups([groupPublic1]);

      const res = await request(app).get(`/v1/groups/${groupPublic1._id}`).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: groupPublic1._id.toHexString(),
        name: groupPublic1.name,
        description: groupPublic1.description,
        private: groupPublic1.private,
        admin: expect.any(Object),
        members: [],
      });
    });
    test('should return 200 for a public group if a user is anonymous', async () => {
      await insertGroups([groupPublic1]);
      await request(app).get(`/v1/groups/${groupPublic1._id}`).send().expect(httpStatus.OK);
    });
    test('should return 403 for a private group if a user is anonymous', async () => {
      await insertGroups([groupPrivate]);
      await request(app).get(`/v1/groups/${groupPrivate._id}`).send().expect(httpStatus.FORBIDDEN);
    });
    test('should return 403 for a private group if a user is not assigned as a group admin', async () => {
      await insertGroups([groupPrivate]);
      await request(app)
        .get(`/v1/groups/${groupPrivate._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });
    test('should return 200 for a private group if a user is assigned as a group admin', async () => {
      await insertUsers([userTwo]);
      await insertGroups([groupPrivate]);
      await request(app)
        .get(`/v1/groups/${groupPrivate._id}`)
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });
    test('should return 200 for a private group if a user is has admin role', async () => {
      await insertUsers([userTwo, admin]);
      await insertGroups([groupPrivate]);
      await request(app)
        .get(`/v1/groups/${groupPrivate._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });
  });

  describe('DELETE /v1/groups/:groupId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertGroups([groupPublic1]);
      await request(app)
        .delete(`/v1/groups/${groupPublic1._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
      const dbGroup = await Group.findById(groupPublic1._id);
      expect(dbGroup).toBeNull();
    });

    test('Should return 403 for anonymous', async () => {
      await insertGroups([groupPublic1]);
      await request(app).delete(`/v1/groups/${groupPublic1._id}`).send().expect(httpStatus.FORBIDDEN);
      const dbGroup = await Group.findById(groupPublic1._id);
      expect(dbGroup).not.toBeNull();
    });

    test('Should return 403 if a user is not the group admin', async () => {
      await insertUsers([userOne, userTwo]);
      await insertGroups([groupPublic1]);
      await request(app)
        .delete(`/v1/groups/${groupPublic1._id}`)
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
      const dbGroup = await Group.findById(groupPublic1._id);
      expect(dbGroup).not.toBeNull();
    });

    test('should return 204 if a user is admin', async () => {
      await insertUsers([userTwo, admin]);
      await insertGroups([groupPrivate]);
      await request(app)
        .delete(`/v1/groups/${groupPrivate._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
      const dbGroup = await Group.findById(groupPrivate._id);
      expect(dbGroup).toBeNull();
    });
  });

  describe('PATCH /v1/groups/:groupId', () => {
    test('should return 200 and successfully update user if data is ok', async () => {
      await insertUsers([userOne]);
      await insertGroups([groupPublic1]);
      const updateBody = {
        name: faker.lorem.words(3),
        description: faker.lorem.words(10),
      };

      const res = await request(app)
        .patch(`/v1/groups/${groupPublic1._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: groupPublic1._id.toHexString(),
        name: updateBody.name,
        description: updateBody.description,
        private: groupPublic1.private,
        admin: expect.any(Object),
        members: [],
      });

      const dbGroup = await Group.findById(groupPublic1._id);
      expect(dbGroup).toBeDefined();
      expect(dbGroup).toMatchObject({ name: updateBody.name, description: updateBody.description });
    });
    test('should return 400 if the request contains unresolved fields: admin', async () => {
      await insertUsers([userOne]);
      await insertGroups([groupPublic1]);
      const updateBody = {
        name: faker.lorem.words(3),
        description: faker.lorem.words(10),
        admin: '606a0be83f29402327faa751',
      };
      // eslint-disable-next-line no-unused-vars
      const res = await request(app)
        .patch(`/v1/groups/${groupPublic1._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
    test('should return 400 if the request contains unresolved fields: members', async () => {
      await insertUsers([userOne]);
      await insertGroups([groupPublic1]);
      const updateBody = {
        name: faker.lorem.words(3),
        description: faker.lorem.words(10),
        members: ['606a0be83f29402327faa751'],
      };
      // eslint-disable-next-line no-unused-vars
      const res = await request(app)
        .patch(`/v1/groups/${groupPublic1._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('Should return 403 for anonymous', async () => {
      await insertGroups([groupPublic1]);
      const updateBody = {
        name: faker.lorem.words(3),
        description: faker.lorem.words(10),
      };
      await request(app).patch(`/v1/groups/${groupPublic1._id}`).send(updateBody).expect(httpStatus.FORBIDDEN);
    });

    test('Should return 403 if a user is not the group admin', async () => {
      await insertUsers([userOne, userTwo]);
      await insertGroups([groupPublic1]);
      const updateBody = {
        name: faker.lorem.words(3),
        description: faker.lorem.words(10),
      };
      await request(app)
        .patch(`/v1/groups/${groupPublic1._id}`)
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 204 if a user is admin', async () => {
      await insertUsers([userTwo, admin]);
      await insertGroups([groupPrivate]);
      const updateBody = {
        name: faker.lorem.words(3),
        description: faker.lorem.words(10),
      };
      await request(app)
        .patch(`/v1/groups/${groupPrivate._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });
  });
});

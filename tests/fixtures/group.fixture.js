const mongoose = require('mongoose');
const faker = require('faker');
const { userOne, userTwo, userThree } = require('./user.fixture');
const Group = require('../../src/models/group.model');

const groupPublic1 = {
  _id: mongoose.Types.ObjectId(),
  name: faker.lorem.words(3),
  description: faker.lorem.words(10),
  private: false,
  admin: userOne._id,
  members: [userThree._id],
};

const groupPublic2 = {
  _id: mongoose.Types.ObjectId(),
  name: faker.lorem.words(3),
  description: faker.lorem.words(10),
  private: false,
  admin: userTwo._id,
  members: [userThree._id],
};

const groupPrivate = {
  _id: mongoose.Types.ObjectId(),
  name: faker.lorem.words(3),
  description: faker.lorem.words(10),
  private: true,
  admin: userTwo._id,
  members: [userThree._id],
};

const insertGroups = async (groups) => {
  await Group.insertMany(groups);
};

module.exports = {
  groupPublic1,
  groupPublic2,
  groupPrivate,
  insertGroups,
};

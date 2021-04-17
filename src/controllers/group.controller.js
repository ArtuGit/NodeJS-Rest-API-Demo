const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { groupService } = require('../services');

const createGroup = catchAsync(async (req, res) => {
  const groupParam = {
    admin: req.user._id,
    ...req.body,
  };
  const group = await groupService.createGroup(groupParam);
  res.status(httpStatus.CREATED).send(group);
});

const getGroups = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'description']);
  filter.private = false;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await groupService.queryGroups(filter, options);
  res.send(result);
});

const getGroup = catchAsync(async (req, res) => {
  const group = await groupService.getGroupById(req.params.groupId, req.user);
  res.send(group);
});

const updateGroup = catchAsync(async (req, res) => {
  const group = await groupService.updateGroupById(req.params.groupId, req.body, req.user);
  res.send(group);
});

const deleteGroup = catchAsync(async (req, res) => {
  await groupService.deleteGroupById(req.params.groupId, req.user);
  res.status(httpStatus.NO_CONTENT).send();
});

const addUserToGroup = catchAsync(async (req, res) => {
  const group = await groupService.addUserToGroup(req.params.groupId, req.user);
  res.send(group);
});

const deleteUserFromGroup = catchAsync(async (req, res) => {
  const group = await groupService.deleteUserFromGroup(req.params.groupId, req.user);
  res.send(group);
});

module.exports = {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
  addUserToGroup,
  deleteUserFromGroup,
};

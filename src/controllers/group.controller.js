const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
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
  const group = await groupService.getGroupById(req.params.groupId);
  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  }
  res.send(group);
});

module.exports = {
  createGroup,
  getGroups,
  getGroup
};

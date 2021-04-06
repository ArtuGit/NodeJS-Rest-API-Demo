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

module.exports = {
  createGroup,
  getGroups,
};

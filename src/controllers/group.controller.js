const httpStatus = require('http-status');
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

module.exports = {
  createGroup,
};

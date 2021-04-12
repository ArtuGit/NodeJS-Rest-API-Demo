const httpStatus = require('http-status');
const { Group } = require('../models');
const ApiError = require('../utils/ApiError');
const { checkUserRole } = require('./authorization.service');

/**
 * Authorize Group Access
 * @param {Object} group
 * @param {Object} user
 * @returns {Boolean}
 */
const authorizeGroupAccess = async (group, user) => {
  if (!group.private) {
    return true;
  }
  if (user && user._id === group._id) {
    return true;
  }

  if (user) {
    if (user._id === group._id) {
      return true;
    }
    const hasRequiredRights = await checkUserRole(user.role, 'manageGroups');
    if (hasRequiredRights) {
      return true;
    }
  }
  return false;
};

/**
 * Create a group
 * @param {Object} groupBody
 * @returns {Promise<Group>}
 */
const createGroup = async (groupBody) => {
  const group = await Group.create(groupBody);
  return group;
};

/**
 * Query for groups
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryGroups = async (filter, options) => {
  const groups = await Group.paginate(filter, options);
  return groups;
};

/**
 * Get group by id
 * @param {ObjectId} id
 * @param {Object} user
 * @returns {Promise<Group>}
 */
const getGroupById = async (id, user) => {
  const group = await Group.findById(id).populate('admin', 'name');
  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  }
  const auth = await authorizeGroupAccess(group, user);
  if (!auth) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  return group;
};

/**
 * Update group by id
 * @param {ObjectId} groupId
 * @param {Object} updateBody
 * @returns {Promise<Group>}
 */
const updateGroupById = async (groupId, updateBody) => {
  const group = await getGroupById(groupId);
  if (!group) {
    // eslint-disable-next-line no-undef
    throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  }
  Object.assign(group, updateBody);
  await group.save();
  return group;
};

/**
 * Delete group by id
 * @param {ObjectId} groupId
 * @returns {Promise<Group>}
 */
const deleteGroupById = async (groupId) => {
  const group = await getGroupById(groupId);
  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  }
  await group.remove();
  return group;
};

module.exports = {
  createGroup,
  queryGroups,
  getGroupById,
  updateGroupById,
  deleteGroupById,
};

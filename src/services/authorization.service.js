const { roleRights } = require('../config/roles');

/**
 * Check User Role, does a user role have role rights
 * @param {String} userRole
 * @param {Array} requiredRights
 * @returns {Boolean}
 */
const checkUserRole = async (userRole, ...requiredRights) => {
  if (requiredRights.length) {
    const userRights = roleRights.get(userRole);
    return requiredRights.every((requiredRight) => userRights.includes(requiredRight));
  }
  return false;
};

module.exports = {
  checkUserRole,
};

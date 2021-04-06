const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const { groupService } = require('../services');

const authGroup = async (req,userId) => {
  const group = await groupService.getGroupById(req.params.groupId);
  if (group && userId) {
    if (userId === group.admin.id) {
      return true;
    }
  }
  return false;
};

const authUser = (req, userId) => {
  if (req.params.userId === userId) {
    return true;
  }
  return false;
};

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights) {
      let allowed = true;
      allowed = authUser(req, user.id);
      console.log('B1');
      if (req.baseUrl === '/v1/groups' && req.url) {
        console.log('B2');
        allowed = await authGroup(req,user.id);
      }
      console.log('B3');
      if (!allowed) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    }
  }
  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;

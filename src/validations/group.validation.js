const Joi = require('joi');

const createGroup = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    private: Joi.boolean().required(),
  }),
};

module.exports = {
  createGroup,
};

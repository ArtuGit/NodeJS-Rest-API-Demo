const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'NodeJS-Rest-API-Demo',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/ArtuGit/NodeJS-Rest-Demo/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

module.exports = swaggerDef;

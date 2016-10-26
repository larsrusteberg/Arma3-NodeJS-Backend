var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'arma3backend'
    },
    port: process.env.PORT || 0
  },

  test: {
    root: rootPath,
    app: {
      name: 'arma3backend'
    },
    port: process.env.PORT || 0
  },

  production: {
    root: rootPath,
    app: {
      name: 'arma3backend'
    },
    port: process.env.PORT || 0
  }
};

module.exports = config[env];

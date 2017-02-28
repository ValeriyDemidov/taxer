'use strict';

const bunyan = require('bunyan');
const appName = global._inf.getConstant('app').appName;

module.exports = {
  ensureLogger: function (log, caller) {
    const key = caller.constructor.name || 'id';
    let property = {};
    property[key] = caller._id || '_';
    if (log) {
      return log.child(property);
    }
    property.name = appName;
    return bunyan.createLogger(property);
  },
  createLogger: name => bunyan.createLogger({name}),
  createChildLogger: (parent, properties) => parent.child(properties)
};

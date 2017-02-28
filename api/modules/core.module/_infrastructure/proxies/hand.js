'use strict';

const Hand = require('./../../cards/containers/hand');

const _assertRepositoryRequest = global._inf.getService('assert-repository-request');

module.exports = {
  createInstance: params => new Hand(params)
};

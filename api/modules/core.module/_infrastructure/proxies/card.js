'use strict';

const Card = require('./../../cards/card');

const _usage = global._inf.getConstant('card/usage-map');
const _repository = require('./../../cards/instance-repository');
const _createAndRegister = global._inf.getService('create-and-register');
const _assertRepositoryRequest = global._inf.getService('assert-repository-request');

module.exports = {
  usage: _usage,
  createEntity: cardPrototype => _createAndRegister(cardPrototype, Card, _repository),
  get: id => _assertRepositoryRequest(id, Card, _repository, 'Can`t instantiate card: unknown identifier')
};

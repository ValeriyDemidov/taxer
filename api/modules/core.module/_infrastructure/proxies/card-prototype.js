'use strict';

const CardPrototype = require('./../../cards/card-prototype');

const _repository = require('./../../cards/prototype-repository');
const _assertRepositoryRequest = global._inf.getService('assert-repository-request');

module.exports = {
  get: cardTitle => _assertRepositoryRequest(cardTitle, CardPrototype, _repository, 'Can`t instantiate card: unknown identifier')
}

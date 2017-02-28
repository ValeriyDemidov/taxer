'use strict';

const Player = require('./../../players/player');

const _repository = require('./../../players/repository');
const _createAndRegister = global._inf.getService('create-and-register');
const _assertRepositoryRequest = global._inf.getService('assert-repository-request');

module.exports = {
  createEntity: data => _createAndRegister(data, Player, _repository),
  get: playerId => _assertRepositoryRequest(playerId, Player, _repository, 'Can`t instantiate player: unknown identifier')
};

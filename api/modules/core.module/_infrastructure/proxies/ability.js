'use strict';

const Ability = require('./../../abilities/ability');

const _createAndRegister = global._inf.getService('create-and-register');
const _repository = require('./../../abilities/repository');

module.exports = {
  get: abilityTitle => _repository.get(abilityTitle)
};

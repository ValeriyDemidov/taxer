'use strict';

const AnimalAggregator = require('./../../animals/aggregator');
const Animal = require('./../../animals/animal');

const _repository = require('./../../animals/repository');
const _createAndRegister = global._inf.getService('create-and-register');
const _assertRepositoryRequest = global._inf.getService('assert-repository-request');

module.exports = {
  createInstance: {
    aggregator: () => new AnimalAggregator()
  },
  createEntity: baseCard => _createAndRegister(baseCard, Animal, _repository),
  get: animalId => _assertRepositoryRequest(animalId, Animal, _repository, 'Can`t instantiate animal: unknown identifier')
};

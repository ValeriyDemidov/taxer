'use strict';

const Deck = require('./../../cards/containers/deck');

const _repository = require('./../../cards/containers/deck-repository');
const _assertRepositoryRequest = global._inf.getService('assert-repository-request');

module.exports = {
  get: deckId => _assertRepositoryRequest(deckId, Deck, _repository, 'Can`t instantiate deck: unknown identifier')
};

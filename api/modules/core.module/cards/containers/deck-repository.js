'use strict';

const Deck = require('./deck');

const _dataSource = global._inf.getModel('deck');
let _deckSpecs = {};

function _register (spec) {
  if (!spec)
    throw new Error('Attempting to register invalid deck specification to repository');
  _deckSpecs[spec.title] = spec;
}

module.exports = {
  register: _register,
  get: (deckId) => {
    const cached = _deckSpecs[deckId];
    if (cached) return new Deck(cached);
    const source = _dataSource.get(deckId)[0];
    if (!source || !source.title) return null;
    _register(source);
    return new Deck({ spec: source });
  }
}

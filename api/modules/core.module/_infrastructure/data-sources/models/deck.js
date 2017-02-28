'use strict';

module.exports = require('./factory')([{
  id: 'deck-data-source',
  model: {
    title: String,
    cards: Object
  },
  adapter: query => {
    const source = require('./data/decks');
    return source[query];
  }
}]);

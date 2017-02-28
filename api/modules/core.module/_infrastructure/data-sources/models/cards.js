'use strict';

module.exports = require('./factory')([{
  id: 'cards-data-source',
  model: {
    title: String,
    base: String,
    modifyer: String
  },
  adapter: query => {
    const source = require('./data/cards');
    return source[query];
  }
}]);

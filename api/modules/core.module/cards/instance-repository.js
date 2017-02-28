'use strict';

let _cards = {};
let Card = require('./card');

module.exports = {
  register: function (card) {
    if (!(card instanceof Card))
      throw new Error('Attempting to register invalid Card to repository');
    _cards[card._id] = card;
  },
  get: cardId => _cards[cardId] || null
};

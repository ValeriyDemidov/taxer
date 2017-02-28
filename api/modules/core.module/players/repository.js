'use strict';

let _players = {};
const Player = require('./player');

module.exports = {
  register: function (player) {
    if (!(player instanceof Player))
      throw new Error('Attempting to register invalid Player to repository');
    _players[player._id] = player;
  },
  get: function (playerId) {
    return _players[playerId] || null;
  }
};

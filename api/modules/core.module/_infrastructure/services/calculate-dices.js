'use strict';

module.exports = function (playersN) {
  return {
    dices: Math.ceil((playersN)/2),
    mod: (playersN%2 == 0) ? 2 : 0
  }
}

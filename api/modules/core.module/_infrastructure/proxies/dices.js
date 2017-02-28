'use strict';

const DiceAggregator = require('./../../dices/aggregator');

module.exports = {
  createInstance: {
    aggregator: diceSpec => new DiceAggregator(diceSpec)
  }
};

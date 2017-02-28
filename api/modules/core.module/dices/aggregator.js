'use strict';

const diceSpecRegexp = new RegExp(/(\d+)d(\d+)([+-]\d+)?/g);
const Dice = require('./dice');

module.exports = class DiceAggregator {

  // Construct dices Aggregator from the spec, eg `2d6+4, 1d12, 2d42`
  constructor(dicesSpec) {
    this.dices = [];
    let match = null;
    while (match = diceSpecRegexp.exec(dicesSpec)) {
      const amount = parseInt(match[1]);
      const sidesN = parseInt(match[2]);
      const mod = match[3];
      // new array 1..sidesN
      const sides = Array.from(Array(sidesN)).map((e,i)=>i+1);
      for (let n = 0; n < amount; n++)
        this.dices.push(new Dice(sides, mod));
    }
  }

  // Roll all the prepared dices
  roll() {
    let result = 0;
    for (let dice of this.dices)
      result += dice.roll();
    return result;
  }

};

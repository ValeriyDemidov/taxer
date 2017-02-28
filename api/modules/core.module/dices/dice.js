'use strict';

const randomAraryUnit = global._inf.getService('array/random-unit');

module.exports = class Dice {
  
  constructor(sides, modifyer) {
    this.sides = sides;
    this.mod = parseInt(modifyer) || 0;
  }

  roll() {
    return randomAraryUnit(this.sides) + this.mod;  
  }
};

'use strict';

const CardContainer = require('./card-container');
// console.log(CardContainer);

module.exports = class Hand extends CardContainer {

  constructor(params) {
    super();
    if (params.owner) {
      this.own(params.owner);
    }
  }

  hasCardEntity (cardId) {
    return this.get(cardId) !== null;
  }

  hasCardOfPrototype (prototypeTitle) {
    for (let card of this.cards) {
      if (card.isEntityOf(prototypeTitle)) {
        return true;
      }
    }
    return false;
  }

  own(owner) {
    // @todo: looks silly
    this.owner = owner;
  }

}

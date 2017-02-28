'use strict';

const CardContainer = require('./card-container');
const cardPrototypeProxy = global._inf.getProxy('card-prototype');
const cardProxy = global._inf.getProxy('card');
const logProvider = global._inf.getService('log-provider');
const _randomArrayUnit = global._inf.getService('array/random-unit');

function _ensureDeckSpecObject (spec) {
  return spec && spec.title && spec.cards;
} 

module.exports = class Deck extends CardContainer {

  /**
   * Constructs deck instance
   */
  constructor(params) {
    super();
    if (!_ensureDeckSpecObject(params.spec)) 
      throw new Error('Attempting to create deck with invalid spec');
    this.title = params.spec.title;
    this.thrown = [];
    this._cardPrototypes = params.spec.cards;
  }

  /**
   * Provides logger for a deck
   */
  provideLogger(log) {
    this.log = logProvider.ensureLogger(log, this);
    this.processSpec();
  }

  /**
   * Processing loaded deck specification
   */
  processSpec() {
    for (let unit in this._cardPrototypes) {
      const cardPrototype = cardPrototypeProxy.get(unit);
      const amount = this._cardPrototypes[unit];
      if (!cardPrototype) {
        return void this.log.error({ unit, amount }, 'Card prototype wasn`t found');
      }
      this.log.info({ unit, amount }, 'Card prototype loaded successfully');
      for (let i = 0; i < amount; i++) {
        const card = cardProxy.createEntity({cardPrototype});
        this.add(card)
      }
    }
  }

  /**
   * Throws card.
   * Thrown cards can be withdrawn when the impact withdraw is required.
   */
  throw (cardId) {
    const cached = this.retrieve(cardId);
    if (cached) return void this.thrown.push(cached._id);
    const card = cardProxy.get(cardId);
    if (!this.isOwnerOf(card))
      return void this.log.warn({cardId}, 'Throw of card is prohibited');
    this.thrown.push(card._id);
  }

  /**
   * Checks if the deck is a hypervisor of specified card
   */
  isOwnerOf (card) {
    return !!(card && card.hypervisor.title === this.title);
  }

  /**
   * Checks if the deck is empty
   */
  isEmpty () {
    return this.count() === 0;
  }

  /**
   * Passes random card to a destination container
   */
  passTo (destination) {
    const idHaystack = (this.isEmpty()) ?
      this.thrown : Object.keys(this.cards);
    const cardId = _randomArrayUnit(idHaystack);
    const _dump = {
      idHaystack: idHaystack.length, 
      cardId, 
      player: destination.name, 
      cardsLeft: this.count()
    };
    if (!super.passTo(cardId, destination.hand)) {
      this.log.error(_dump, 'Withdraw failed');
    } else {
      this.log.info(_dump, 'Withdrawing card');
    }
  }

}

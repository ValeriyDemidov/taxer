'use strict';

const cardsProxy = global._inf.getProxy('card');

module.exports = class CardContainer {

  /**
   * Constructs container instance
   */
  constructor() {
    this.cards = {};
  }

  /**
   * Adds card entity to container
   */
  addEntity (card) {
    if (!card instanceof CardContainer)
      this.log.error({card}, 'Attempting to add invalid card entity to container');
    return this.cards[card._id] = card;
  }

  /**
   * Adds card to container by cardIdentifyer
   */
  add (cardId) {
    const cached = this.cards[cardId];
    if (cached) return cached;
    const card = cardsProxy.get(cardId) || null;
    if (!card) return null;
    this.cards[cardId] = card;
    return card;
  }

  /**
   * Retrieves card from container and adds it to another `destination` container
   */
  passTo (cardId, destination) {
    if (!(destination instanceof CardContainer))
      return void this.log.error({cardId, destination},'Attempting to pass card to an invalid container');
    return destination.addEntity(this.retrieve(cardId));
  }

  /**
   * Counts cards in a container
   */
  count () {
    return Object.keys(this.cards).length;
  }

  /**
   * Returns array of all card id's in a container
   */
  list () {
    return Object.keys(this.cards);
  }

  /**
   * Get card instance with specified id from the hand
   */
  get (cardId) {
    return this.cards[cardId] || null;
  }

  /**
   * Removes card from the container and returns it
   */
  retrieve (cardId) {
    const cached = this.get(cardId);
    if (cached) delete this.cards[cardId];
    return cached;
  }

  /**
   * Drops all cards
   */
  drop () {
    this.cards = {};
  }

};

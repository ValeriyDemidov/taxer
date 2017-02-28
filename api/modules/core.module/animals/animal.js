'use strict';

const Decorator = require('./animal.decorator');

const generate = global._inf.getService('generators/id');
const logProvider = global._inf.getService('log-provider');
const handProxy = global._inf.getProxy('card');

const PROPERTY_TYPES = {
  ability: '_applyAbility',
  booster: '_applyBooster',
  blocker: '_applyBlocker'
}

module.exports = class Animal {

  /**
   * Constructs animal entity
   */
  constructor (params) {
    this.baseCard = params.baseCard;
    if (!baseCard || !baseCard.isValidCard)
      throw new Error('Animal was initialized with invalid base card');
    this._id = generate.globalIdentifyer('animal');
    this.log = logProvider.ensureLogger(params.log, this);
    this.hand = handProxy.createInstance({ owner: this, log: this.log });
    this.isValidAnimal = true;
    // decorators
    const decoratorParameters = { log: this.log };
    this.abilityDecorator = new Decorator(decoratorParameters);
    this.boostDecorator = new Decorator(decoratorParameters);
    this.blockerDecorator = new Decorator(decoratorParameters);
    // how much food you need to survive
    this.foodNeeds = 1;
    // what is your limit of food grabbing (fat tissue case)
    this.foodCapacity = 1;
    // animal food satiety (current amount of food)
    this.satiety = 0;
    // amount of filled fat tissue points
    this.fatTissue = 0;
  }

  /**
   * Checks if animal is fed enought
   */
  isFed() {
    return this.satiety >= this.foodNeeds;
  }

  /**
   * Animal feeding function
   * @param  {number}  amount       -- amount of eaten food points
   * @param  {boolean} fromFoodBanc -- defines if food was taken from foodBand directly or not
   */
  feed(amount, fromFoodBanc) {
    if (!this.isFed())
      return void (this.satiety += amount);
    if (fromFoodBanc)
      return void this.storeFat(amount);
  }

  /**
   * Fat storing function
   * @param  {number} amount -- amount of fat units to store
   */
  storeFat(amount) {
    const fatCapacity = this.foodCapacity - his.foodNeeds;
    this.fatTissue = Math.min(this.fatTissue + amount, fatCapacity);
  }

  /**
   * Checks if animal still have food capacities to fill
   */
  haveFoodCapacities() {
    // if animal is not fed -- it still can gather food
    if (!this.isFed()) return true;
    // @todo: think about ability onAdd, onRemove, or parameter modifyers @id4
    return true;
  }

  /**
   * Attaches specified card to an animal and applies all card`s properties
   * @param  {Card} card -- instance of attached card
   */
  attachCard(card) {
    this.hand.add(card);
    for (let prop of card.properties) {
      this._applyProperty(prop);
    }
  }

  /**
   * Retrieves card from animal`s hand. All card`s properties would be removed.
   * @param  {Card} card -- instance of retrieved card
   */
  retrieveCard(card) {
    this.hand.retrieve();
  }

  /**
   * Returns list of all animal's blocker properties and functions
   */
  getBlockers() {
    return this.blockerDecorator.list();
  }

  /**
   * Returns list of all animal's abilities
   */
  getAbilities() {
    return this.abilityDecorator.list(); 
  }

  /**
   * Applies abstract card property to an animal
   * @param  {Object} property -- property to be applied
   */
  _applyProperty(property) {
    const type = (property) ? property.type : null;
    if (!type) {
      return void this.log.warn('Attempting to apply empty or untyped property');
    }
    const body = property.body;
    if (!body) {
      return void this.log.warn('Attempting to apply property without body');
    }
    // property type switcher here
    const propertyProcessor = PROPERTY_TYPES[type];
    if (!propertyProcessor) {
      return void this.log.warn('Attempting to apply property of unknown type');
    }
    this[propertyProcessor](property.title);
  }

  /**
   * Property checkers
   * @return {Boolean} -- returns true if an animal has specified property
   */
  hasAbility(ability) {
    return this.abilityDecorator.check(ability);
  }

  hasBoost(boost) {
    return this.boostDecorator.check(boost);
  }

  hasBlocker(blocker) {
    return this.blockerDecorator.check(blocker);
  }

  /**
   * Property setters
   */
  _applyAbility(ability) {
    this.abilityDecorator.decorate(ability);
  }

  _applyBooster(booster) {
    this.boostDecorator.decorate(booster);
  }

  _applyBlocker(blocker) {
    let value = null;
    let property = blocker;
    if (blocker instanceof Function) {
      value = blocker;
      property = generate.propertyIdentifyer();
    }
    this.blockerDecorator.decorate(property, value);
  }

};

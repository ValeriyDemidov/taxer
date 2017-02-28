'use strict';

let generate = null;
let logProvider = null;
let tableProxy = null;
let cardProxy = null;
let handProxy = null;
let animalProxy = null;

function loadInfrastructure() {
  generate = global._inf.getService('generators/id');
  logProvider = global._inf.getService('log-provider');
  tableProxy = global._inf.getProxy('table');
  cardProxy = global._inf.getProxy('card');
  handProxy = global._inf.getProxy('hand');
  animalProxy = global._inf.getProxy('animal');
  loadInfrastructure = function(){};
}

module.exports = class Player {

  /**
   * Constructs player entity
   */
  constructor(params) {
    loadInfrastructure();
    this._id = generate.globalIdentifyer('player');
    this.sitsTo(params.table);
    // player`s parameters
    this.name = params.playerData.name;
    this.gender = params.playerData.gender;
    // -------------------
    this.log = logProvider.ensureLogger(params.log, this);
    this.hand = handProxy.createInstance({ owner: this, log: this.log });
    this.animals = animalProxy.createInstance.aggregator();
  }

  /**
   * Returns list of all player's handed cards
   */
  listHand() {
    return this.hand.list();
  }

  /**
   * Returns list of all player's animals entities
   */
  listAnimals() {
    return this.animals.list();
  }

  /**
   * Attaches player to specified table
   * @param  {String} tableId
   */
  sitsTo(tableId) {
    this._table = tableId;
  }

  /**
   * @return {Table} attached table instance
   */
  getTable() {
    return tableProxy.get(this._table);
  }

  /**
   * Remove animal from player's ownership
   * @param  {String} animalId
   */
  retrieveAnimal(animalId) {
    this.animals.get(animalId).setOwner(null);
    this.animals.remove(animalId);
  }

  /**
   * Adds new animal to player's ownership
   * @param  {String} animalId
   */
  ownAnimal(animalId) {
    this.animals.add(animalId);
  }

  /**
   * Performs action with `cardId` card ability of `animalId` animal
   * @param  {String} cardId   -- id of card to cast an action
   * @param  {String} args     -- cast arguments
   * @return {Boolean}         -- true if cast was performed
   */
  castAction(cardId, args) {
    // card retrieving and validation
    const cardOwnerId = this.findCardOwner(cardId);
    if (!cardOwnerId) {
      return void this.log.error({ cardId },'Attempting to cast action with unknown card');
    }
    const card = animalProxy.get(cardOwnerId).hand.get(cardId);
    // casting an action
    card.trigger(args);
  }

  /**
   * Lookup player's animals and attemps to find card owner
   * @param  {String} cardId -- desired card id
   * @return {String}        -- owner animal id or null if noone found
   */
  findCardOwner(cardId) {
    const animals = this.animals.list();
    for (let id of animals) {
      const anm = animalProxy.get(id);
      const card = anm.hand.get(cardId);
      // @todo: mb i should return animal entity here to prohibit additional proxy.get calls
      if (card) return id;
    }
    return null;
  }

  /**
   * Player attempts to use a card from his hand on some animal
   * @param  {String} cardId   -- desired card id
   * @param  {String} usage    -- card usage (base, mod, downside, etc.)
   * @param  {String} animalId -- target animal id (if not specified then new animal has to be created)
   */
  useCard(cardId, usage, animalId) {
    if (!cardId || !usage)
      return void this.log.error({cardId, usage}, 'Cant use card: invalid parameters');
    if (this.hand.isInHand(cardId))
      return void this.log.error({cardId}, 'Cant use card: no such in a hand');
    if (!animalId) {
      if (usage != cardProxy.usage.downside)
        return void this.log.error({cardId, usage}, 'Cant use card: no invalid usage');
      // new animal usage
      this.ownAnimal(animalProxy.createEntity({
        base: this.hand.retrieve(cardId),
        owner: this,
        log: this.log
      }));
    } else {
      // ability usage
      animalProxy.get(animalId).apply(this.hand.retrieve(cardId).use(usage));
    }
  }

  /**
   * Player passes his turn
   */
  pass() {
    const motionObject = this.makeMotionParameters('pass');
    this.getTable().triggerMotion(motionObject);
  }

  /**
   * Player-related motion object fabric
   */
  makeMotionParameters(motionName, parameters) {
    return { 
      player: this._id,
      motion: motionName,
      motionArguments: parameters
    };
  }

};

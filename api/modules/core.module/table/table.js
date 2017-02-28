'use strict'

const stageProvider = require('./../stages');
const logProvider = global._inf.getService('log-provider');
const generate = global._inf.getService('generators/id');
const rejectionPipeline = global._inf.getService('rejection-pipeline');
const motionRejecter = global._inf.getService('rejectors/motion');
const valuesOf = global._inf.getService('values-of');
const motionProspects = global._inf.getService('motion-prospects');

const deckProxy = global._inf.getProxy('deck');
const playerProxy = global._inf.getProxy('player');

module.exports = class Table {

  /**
   * Table constructor
   * @param  {Bunyan} params.log -- parent bunyan logger if chaining is desired
   */
  constructor(params) {
    this._id = generate.globalIdentifyer('table');
    this.log = logProvider.ensureLogger(params.log, this);
    this.motionCallback = params.onMotionTriggered || null;
    this.players = [];
    this.stageProcessor = stageProvider.createProcessor(this);
    this.currentPlayer = 0;
  }

  /**
   * Registering player at a table
   * Only while table is initializing
   * @param  {Object} playerData -- object that contains name, gender, age, etc.
   */
  registerPlayer(playerData) {
    if (this.locked)
      return void this.log.warn(`Player registration is prohibited: table is locked.`);
    const playerParameters = {
      playerData: playerData,
      table: this._id,
      log: this.log
    };
    this.players.push(playerProxy.createEntity(playerParameters));
    this.currentPlayer = this.players.length - 1;
  }

  /**
   * Applies copy of deck with specified id to this table
   * Do nothing if there is no deck with such id
   * @param  {String} deckId -- identifier of desired deck
   */
  useDeck(deckId) {
    if (this.locked)
      return void this.log.warn(`Deck usege is prohibited: table is locked.`);
    const deck = deckProxy.get(deckId);
    if (!deck)
      return void this.log.warn(`No any deck found with id: ${deckId}`);
    this.log.info(`Deck '${deckId}' was used`);
    this.deck = deck;
  }

  /**
   * Starts the game. 
   * No more player's registration or deck usage is available.
   */
  start() {
    if (!this.isReady()) {
      this.stageProcessor.trigger();
    }
  }

  /**
   * Locks table bootstrapping functions
   */
  lock() {
    this.locked = true;
  }

  /**
   * Returns currently active player id
   */
  getDealer() {
    // @todo: current player logic here
    return this.currentPlayer;
  }

  /**
   * Checks if the table has a player sitting with `playerId`
   */
  hasPlayer(playerId) {
    return this.players.indexOf(playerId) >= 0;
  }

  /**
   * Returns list of all registered players
   */
  listPlayers() {
    return this.players;
  }

  /**
   * Checks if the table is ready to perform player`s motions
   */
  isReady() {
    return !!(this.locked && this.deck);
  }

  /**
   * Motion access function (stage processor wrapper)
   * Rejects `player` and `motion` parameters
   */
  triggerMotion(data) {
    const playerId = data.player || null;
    const motionName = data.motion || null;

    const rejectionLayers = [
      x=>motionRejecter.test(motionName, this)
    ];

    const rejection = rejectionPipeline(rejectionLayers);
    if (rejection) {
      rejection.caller = playerId;
      this.log.warn(rejection, 'Motion attempt rejected');
      return false;
    }

    const motionArguments = data.motionArguments || {};
    try {
      this.stageProcessor.trigger(motionArguments);
    } catch (e) {
      if (e.name == 'ProcessorInProgress') {
        this.log.error({ caller: playerId, motion: motionName }, 'Attempting to trigger stage while current is in progress');
      }
    }

    return true;
  }

  /**
   * Returns current table's stage
   */
  getCurrentStage() {
    return this.stageProcessor.currentStage();
  }

  /**
   * Returns list of all available prospects for each player registered
   */
  getProspects() {
    return motionProspects(this._id);
  }
};

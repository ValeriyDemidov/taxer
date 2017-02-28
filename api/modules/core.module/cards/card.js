'use strict';

const USAGE = global._inf.getConstant('card/usage-map');
const logProvider = global._inf.getService('log-provider');
const generate = global._inf.getService('generators/id');

module.exports = class Card {

  /**
   * Constructs card entity
   */
  constructor (params) {
    this.log = logProvider.ensureLogger(params.log, this);
    if (!params.cardPrototype) {
      this.log.error('Attempting to instantinate card without prototype');
    }
    this._id = generate.globalIdentifyer('card');
    this.usage = null;
    this.hypervisor = params.hypervisor || null;
    this.cardPrototype = params.cardPrototype;
    this.cooldown = 0;
  }

  /**
   * Checks if this card was used
   */
  isUsed () {
    return this.usage !== null;
  }

  /**
   * Performs card usage motion. 
   * @param  {String} usage -- side of card to use
   */
  use (usage) {
    const u = USAGE[usage];
    if (!u) {
      return void this.log.error({usage}, 'Invalid usage parameter met');
    }
    if (u == USAGE.downside) {
      return void (this.usage = u);
    }
    if (!this.cardPrototype.hasAbility(u)) {
      return void this.log.warn({usage}, 'Attempting to reach ability that is not specified');
    }
    this.usage = u;
    this.properties = this.cardPrototype.abilities[u];
  }

  /**
   * Triggers action processor if everithing is ok
   * @param  {Object} args -- custom arguments object for action processor
   */
  trigger (args) {
    args = args || {};
    if (!this.isUsed())
      return void this.log.warn('Attempting to trigger still unused card');
    if (this.usage === USAGE.downside)
      return void this.log.warn('Attempting to trigger with card, used downside');
    if (this.isCooling())
      return void this.log.warn('Attempting to trigger card in a cooldown state');
    if (!this.isProcessingAllowed(args))
      return void this.log.warn('Card triggering condition check failed');
    if (!this.properties.processor)
      return void this.log.warn('Attempting to trigger passive ability');
    // @todo: add some restrictions here?
    this.properties.processor.call(this, args);
    this.cooldown = this.properties.cooldown;
  }

  /**
   * Checks if the card state and arguments suite action conditions
   * @param  {Object}  args -- custom arguments object
   */
  isProcessingAllowed (args) {
    if (!this.properties) return false;
    return !this.properties.processingCondition || this.properties.processingCondition.call(this, args);
  }

  /**
   * Checks if this card is in a cooldown satate
   */
  isCooling () {
    return this.cooldown > 0;
  }

  /**
   * Checks if the card is an entity of a `prototypeTitle` prototype
   */
  isEntityOf (prototypeTitle) {
    return this.cardPrototype.title == prototypeTitle;
  }

  /**
   * Throws card out to the hypervisor's junk
   */
  throw () {
    if (this.hypervisor)
      this.hypervisor.throw(this._id);
  }

  /**
   * Returns ability targeting
   * @param {string} type -- targeting type to return (usage/trigger)
   */
  getTargeting (type) {
    if (!this.isProcessingAllowed()) return -1;
    if (type == 'usage')
      return this.properties.usageTargeting;
    if (type == 'trigger')
      return this.properties.triggerTargeting;
    return -1;
  }
};

'use strict';

const logProvider = global._inf.getService('log-provider');

module.exports = class AnimalDecorator {

  /**
   * Constructs decorator object
   */
  constructor(params) {
    this.log = logProvider.ensureLogger(params.log, this);
    this.decorationSlots = {};
  }

  /**
   * Lists all decorations as array
   */
  list() {
    return Object.keys(this.decorationSlots).map(key => 
      (this.decorationSlots[key] instanceof Function) ? 
        this.decorationSlots[key] : key);
  }

  /**
   * Decorate instance with property
   * If slot is already filled -- increment amount
   */
  decorate(property, value) {
    if (value) return void (this.decorationSlots[property] = value); 
    this.decorationSlots[property] = this.decorationSlots[property] || 0 + 1;
  }

  /**
   * Undecorate instance with property
   * If slot becomes empty it would be deleted
   * Otherwise -- decrement amount
   */
  undecorate(property) {
    if (!this.decorationSlots[property]) return;
    // @todo: valued undecoration issue here
    if (this.decorationSlots[property] <= 1)
      return void delete this.decorationSlots[property];
    this.decorationSlots[property] -= 1;
  }

  /**
   * Check of specified decoration property existance
   * @return {Boolean} -- returns true, if specified property exists
   */
  check(property) {
    return (this.decorationSlots[property]) ? true : false;
  }
}

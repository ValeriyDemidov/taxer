'use strict';

module.exports = class Ability {

  /**
   * Ability entity construction
   */
  constructor(params) {
    for (let prop in params) {
      this[prop] = params[prop];
    }
  }

  /**
   * Alias for processingCondition function
   */
  canBePerformed(actor, target) {
    return !this.processingCondition || this.processingCondition(actor, target);
  }
};

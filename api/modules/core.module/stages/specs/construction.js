'use strict';

const playerProxy = global._inf.getProxy('player');
const PassAccumulator = global._inf.getService('passes-accumulator');

/**
 * CONSTRUCTION STAGE
 */

/**
 * Responsible for state object initialization
 */
function _preprocessConstruction() {
  this.log.info('Entering Construction stage');
  this.$cache = {
    passAccumulator: new PassAccumulator(this.$.model.table)
  }
}

/**
 * Current player puts the card. Somehow.
 */
function _processConstruction(options) {
  const acc = this.$cache.passAccumulator;
  const dealer = playerProxy.get(acc.get());
  const cardId = options.card;
  
  this.log.info({
    player: dealer._id,
    passed: this.$cache.passAccumulator.passes.size,
    cardId
  }, 'Processing stage');

  // pass motion is triggered without card id
  if (!cardId) {
    acc.pass();
    return true;
  }

  // default usage of card
  dealer.useCard(cardId, options.usage, options.animal);
  acc.next();
}

/**
 * Calculate animals model after construction is finished
 */
function _postrocessConstruction() {
  this.$.model.animals = [];
  for (let playerId of this.$.model.actors) {
    const pl = playerProxy.get(playerId);
    this.$.model.animals.concat(pl.animals.list());
  }
}

/**
 * Rejectors goes here
 */
function _triggerCondition(options) {
  return true;
}

/**
 * Switches to the next stage, if needed
 * @param  {Boolean} passed -- `true` if player's pass was performed
 */
function _chainSwitcher(passed) {
  if (!passed) return;
  if (this.$cache.passAccumulator.isFilled()) {
    return 'default';
  }
}

/**
 * Exporting stage
 */
module.exports = {
  name: 'construction',
  onStageEnter: _preprocessConstruction,
  onStageLeave: _postrocessConstruction,
  onTrigger: _processConstruction,
  triggerCondition: _triggerCondition,
  chainSwitcher: _chainSwitcher
};

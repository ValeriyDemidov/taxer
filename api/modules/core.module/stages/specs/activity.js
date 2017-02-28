'use strict';

const PassAccumulator = global._inf.getService('passes-accumulator');
const playerProxy = global._inf.getProxy('player');
const animalProxy = global._inf.getProxy('animal');
const MOTION = global._inf.getConstant('prospections');
/**
 * ACTIVITY STAGE
 */

function _preprocessActivity() {
  this.log.info('Entering Activity stage');
  let _satiety = {};
  this.$cache = {
    passAccumulator: new PassAccumulator(this.$.model.table),
    foodBank: this.$.model.table.dices.roll()
  }
}

/**
 * Activity motion processor
 */
function _processActivity(options) {

  const acc = this.$cache.passAccumulator;
  const dealer = playerProxy.get(acc.get());
  const cardId = options.card;
  const animalId = options.animal;
  this.log.info('Processing stage');

  switch (options.motion) {
    case MOTION.TYPES.PASS:
      acc.pass();
      break;
    case MOTION.TYPES.FEED:
      this.$cache.foodBank--;
      animalProxy.get(animalId).feed(1, true);
      acc.drop();
      break;
    case MOTION.TYPES.CAST:
    case MOTION.TYPES.ASSAULT:
      dealer.castAction(cardId, ontions.args);
      acc.drop();
      break;
    default: this.log.error({ options }, 'Unknown motion met');
  }

  acc.tick();
}

/**
 * Cooldown processing
 */
function _postprocessActivity() {
  return;
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

module.exports = {
  name: 'activity',
  onStageEnter: _preprocessActivity,
  onStageLeave: _postprocessActivity,
  onTrigger: _processActivity,
  chainSwitcher: _chainSwitcher
};

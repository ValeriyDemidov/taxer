'use strict';

const calculateDices = global._inf.getService('calculate-dices');
const diceProxy = global._inf.getProxy('dices');

/**
 * BOTSTRAP STAGE
 */

// Initiates game process after the game was started. 
function _processBootstrapping() {
  const $table = this.$.model.table;
  const calculated = calculateDices($table.players.length);
  $table.dices = diceProxy.createInstance.aggregator(`${calculated.dices}d6+${calculated.mod}`);
  $table.useDeck('starter');
  if (!$table.deck) {
    // @todo: bad things here
  }
  $table.deck.provideLogger($table.log);
  $table.lock();
}

module.exports = {
  name: 'bootstrap',
  onTrigger: _processBootstrapping
};


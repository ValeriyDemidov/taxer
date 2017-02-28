'use strict';

const playerProxy = global._inf.getProxy('player');
const bootstrapCardsAmount = global._inf.getConstant('card/bootstrap-amount');

/**
 * DEALING STAGE
 */

// withdraw cards for each player
function _processDealing() {
  let $actors = this.$.model.actors;
  let $table = this.$.model.table;
  for (let playerId of $actors) {
    const pl = playerProxy.get(playerId);
    const animalsAmount = pl.animals.count();
    const cardsToDraw = !(pl.hand.count() || animalsAmount) ?
      bootstrapCardsAmount :
      animalsAmount + 1;
    for (let i = 0; i < cardsToDraw; i++) {
      $table.deck.passTo(pl);
    }
  }
}

module.exports = {
  name: 'dealing',
  autoTrigger: true,
  onTrigger: _processDealing
};

'use strict';

const Rejector = require('./module/rejector');
const REASONS = global._inf.getConstant('rejections/reasons/player');

/**
 * Rejector function returns true, if specified actions are not allowed
 * Rejects player existence at the table
 */
module.exports = new Rejector('player', (playerId, table) => {
  if (!playerId || !table)
    return REASONS.PARAM_REQ;
  if (!table.isReady())
    return { reason: REASONS.NOT_READY };
  if (!table.hasPlayer(playerId))
    return { reason: REASONS.NO_PLAYER };
  return false;
});

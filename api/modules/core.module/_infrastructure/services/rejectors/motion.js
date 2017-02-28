'use strict';

const Rejector = require('./module/rejector');
const REASONS = global._inf.getConstant('rejections/reasons/motion');
const ALLOWED = global._inf.getConstant('rejections/allowed-motions');

/**
 * Rejector function returns true, if specified actions are not allowed
 * Rejects currently processing motion stage
 */
module.exports = new Rejector('motion', (motionName, table) => {
  if (!motionName || !table)
    return REASONS.PARAM_REQ;
  if (!table.isReady())
    return { reason: REASONS.NOT_READY };
  const currentStage = table.getCurrentStage();
  if (ALLOWED.indexOf(motionName) < 0)
    return { motion: motionName, reason: REASONS.NOT_ALLOWED };
  if (motionName !== 'pass' && currentStage !== motionName)
    return { motion: motionName, current: currentStage, reason: REASONS.WRONG_MOTION };
  return false;
});

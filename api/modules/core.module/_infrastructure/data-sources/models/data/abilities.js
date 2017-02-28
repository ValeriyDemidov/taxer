'use strict';

const TARGETS = global._inf.getConstant('targets');

module.exports = {
  'swimming': {
    // SWIMMING
    title: 'Swimming',
    boosts: ['swimming'],
    blockers: ['swimming', function(){return;}]
  },
  'carnivorous': {
    // CARNIVOROUS
    title: 'Carnivorous',
    foodBoost: 1,
    triggerTargeting: TARGETS.other,
    processor: (emitter, target) => {
      console.log(`${emitter._id} Yum-yum! ${target._id}`);
    }
  }
};

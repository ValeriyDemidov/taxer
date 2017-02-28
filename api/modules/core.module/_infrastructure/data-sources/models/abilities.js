'use strict';

const parametersSpec = global._inf.getService('parameters-spec');
const TARGETS = global._inf.getConstant('targets');
const Enum = parametersSpec.Enum;
const _valuesOf = global._inf.getService('values-of');
const targetingEnum = new Enum(..._valuesOf(TARGETS));

module.exports = require('./factory')([{
  id: 'ability-data-source',
  model: {
    title: {
      type: String,
      required: true
    }, 
    usageTargeting: {
      type: targetingEnum,
      default: TARGETS.self
    },
    triggerTargeting: {
      type: targetingEnum,
      default: TARGETS.any
    },
    foodBoost: {
      type: Number,
      default: 0
    },
    paired: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    cooldown: {
      type: Number,
      default: 1
    },
    boosts: Array,
    blockers: Array,
    processor: Function,
    processingCondition: Function
  },
  adapter: query => {
    const source = require('./data/abilities');
    return source[query];
  }
}]);

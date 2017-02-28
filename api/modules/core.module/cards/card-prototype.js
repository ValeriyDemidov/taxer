'use strict';

const logProvider = global._inf.getService('log-provider');
const USAGE = global._inf.getConstant('card/usage-map');
const abilityProxy = global._inf.getProxy('ability');

module.exports = class CardPrototype {

  /**
   * Constructs card prototype
   */
  constructor(params) {
    const cardSpec = params.cardSpec;
    if (!cardSpec) {
      throw new Error('Card Prototype constructor must be provided with card specification object'); }
    if (!cardSpec.title || !cardSpec.base) {
      throw new Error('Card specification object must contain at least `title` and `base` fields'); }

    this.abilities = [];
    if (cardSpec.base)
      this.abilities[USAGE.base] = abilityProxy.get(cardSpec.base);
    if (cardSpec.modifier)
      this.abilities[USAGE.modifier] = abilityProxy.get(cardSpec.modifier);
  }

  /**
   * Checks if this card have base/modifyer ability
   */
  hasAbility (usage) {
    return this.abilities[USAGE[usage]] !== undefined;
  }
  
}

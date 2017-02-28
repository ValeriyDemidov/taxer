'use strict';

const CardPrototype = require('./card-prototype');

const _dataSource = global._inf.getModel('cards');
let _cardPrototypes = {};

module.exports = {
  register: function (prototype) {
    if (!(prototype instanceof CardPrototype))
      throw new Error('Attempting to register invalid Card prototype to repository');
    _cardPrototypes[prototype.title] = prototype;
  },
  get: function (prototypeTitle) {
    const cached = _cardPrototypes[prototypeTitle];
    if (cached instanceof CardPrototype) return cached;
    const source = _dataSource.get(prototypeTitle)[0];
    if (!source) return null;
    const newOne = new CardPrototype({ cardSpec:source });
    this.register(newOne);
    return newOne;
  }
};

'use strict';

const Ability = require('./ability');

const _dataSource = global._inf.getModel('abilities');
let _abilities = {};

function _register (ability) {
  if (!(ability instanceof Ability))
    throw new Error('Attempting to register invalid ability to repository');
  _abilities[ability.title] = ability;
}

module.exports = {
  register: _register,
  get: function (abilityTitle) {
    const cached = _abilities[abilityTitle];
    if (cached instanceof Ability) return cached;
    const source = _dataSource.get(abilityTitle)[0];
    if (!source) return null;
    const newOne = new Ability(source);
    _register(newOne);
    return newOne;
  }
};

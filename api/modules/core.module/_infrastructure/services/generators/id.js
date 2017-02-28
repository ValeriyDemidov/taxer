'use strict';

const repository = require('./id.repository');
const _hashSource = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

module.exports = {
  globalIdentifyer: (prefix) => {
    prefix = prefix || 'entity';
    const seed = repository.getSeed();
    let id = `${prefix}-${seed}`;
    repository.register(id);
    return id;
  },
  propertyIdentifyer: (length) => {
  	length = length || 16;
  	let result = '';
  	for( var i=0; i < length; i++ )
        result += _hashSource.charAt(Math.floor(Math.random() * _hashSource.length));
    return result;
  }
};

'use strict';

// returns random unit of an array
module.exports = array => {
  const pos = Math.floor(Math.random()*array.length)
  return array[pos];
};

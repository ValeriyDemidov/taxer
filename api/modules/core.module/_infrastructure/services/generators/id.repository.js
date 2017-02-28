'use strict';

let seed = 1;
let seedLength = 14;

module.exports = {
  getSeed: function () {
    let result = seed.toString();
    while (result.length < seedLength)
      result = '0' + result;
    return result;
  },
  register: function (id) {
    seed++;
  },
  idExists: function (id) {
    return parseInt(id) >= seed;
  }
};

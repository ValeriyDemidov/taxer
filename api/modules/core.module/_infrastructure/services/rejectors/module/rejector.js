'use strict';
module.exports = class Rtjector {
  constructor(layer, tester) {
    this.layer = layer;
    this.tester = tester;
  }

  test(...args) {
    const result = this.tester(...args);
    return (result) ?
      { layer: this.layer, result } :
      null;
  }
};
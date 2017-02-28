'use strict';

/**
 * Passes accumulation class
 * Used to count player's passes per turn and handle next pleyer sequence at a table
 */

module.exports = class PassesAccumulator {

  constructor (table) {
    this.players = table.players;
    this.current = table.getDealer();
    this.passes = new Set();
  }

  /**
   * Increments current player pointer
   * Regardless of passes state
   * Handles array owerflowing 
   */
  tick() {
    this.current = (this.current + 1) % this.players.length;
  }

  /** Get current player id */
  get() {
    return this.players[this.current];
  }

  /**
   * Moves pointer to next player without pass state
   * @return {String} -- next player id
   */
  next() {
    let ctx = true;
    let limit = this.players.length;
    while (ctx && limit-- > 0) {
      this.tick();
      ctx = this.passes.has(this.get());
    }
    return this.get();
  }

  /** Sets current player to passed state */
  pass(skipPassFlag) {
    this.passes.add(this.get());
    this.tick();
  }

  /** Checks if passes set is filled (true if all pleyers passed) */
  isFilled() {
    return this.passes.size >= this.players.length;
  }

  /** drops passes set (all players set to `not passed` state) */
  drop() {
    this.passes.clear();
  }

}

'use strict';

module.exports = class AnimalAggregator {

  constructor() {
    this.animals = {};
  }

  add (id, instance) {
    this.animals[id] = instance;
  }

  get (id) {
    return this.animals[id];
  }

  remove (id) {
    delete this.animals[id];
  }

  count () {
    return Object.keys(this.animals).length;
  }

  list () {
    return Object.keys(this.animals);
  }
} 

'use strict';

let _animals = {};

module.exports = {
  register: function (animal) {
    if (!animal || !animal.isValidAnimal)
      throw new Error('Attempting to register invalid Animal to repository');
    _animals[animal._id] = animal;
  },
  get: function (animalId) {
    return _animals[animalId] || null;
  }
};

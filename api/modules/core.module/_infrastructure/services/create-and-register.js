'use strict';

module.exports = (params, Prototype, _repository) => {
  const instance = new Prototype(params);
  _repository.register(instance);
  return instance._id;
};

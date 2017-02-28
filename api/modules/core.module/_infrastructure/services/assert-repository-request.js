'use strict';

module.exports = (id, Prototype, _repository, assertionMsg, log) => {
  const instance = _repository.get(id);
  if (!instance instanceof Prototype) {
    log.error({requestedId: id}, assertionMsg);
    return null;
  }
  return instance;
};


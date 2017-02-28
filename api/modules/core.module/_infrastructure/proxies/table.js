'use strict';
const Table = require('./../../table/table')

const _repository = require('./../../table/repository');
const _createAndRegister = global._inf.getService('create-and-register');
const _assertRepositoryRequest = global._inf.getService('assert-repository-request');

module.exports = {
  get: tableId => _assertRepositoryRequest(tableId, Table, _repository, 'Can`t instantiate Table: unknown identifier'),
  createEntity: args => _createAndRegister(args, Table, _repository)
};

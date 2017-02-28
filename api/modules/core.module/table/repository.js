'use strict';

let _tables = {};
const Table = require('./table');

module.exports = {
  register: function (table) {
    if (!(table instanceof Table))
      throw new Error('Attempting to register invalid Table to repository');
    _tables[table._id] = table;
  },
  get: function (tableId) {
    return _tables[tableId] || null;
  }
};

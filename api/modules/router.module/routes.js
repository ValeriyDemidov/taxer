'use strict';

module.exports = {

  'put /table/:id/start': [require('./handlers/table-start')],
  'get /table/:id/prospects': [require('./handlers/get-table-prospects')],
  'get /player/:id/prospects': [require('./handlers/get-player-prospects')],
  'put /player/:id/enter/:tableId': [require('./handlers/player-enter-table')],
  'put /player/:id/leave/:tableId': [require('./handlers/player-leave-table')],
  'post /motion/:tableId/:playerId': [require('./handlers/motion')],

  'post /table': function(server) {
    return [
      function (req, res, next) {
        const tableId = coreProxy('table').createEntity();
        console.log('yooooooooo');
        next(req, res);
      },
      server._modules.database.resources.table.insert()
    ];
  },

};
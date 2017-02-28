'use strict';

function _inject(server) {
  server.get('/dummy', function (req, res, next) {
    server.log.info('Dummy fired!');
    res.send('Dummy Dum');
  });
}

module.exports = {
  inject: _inject
};

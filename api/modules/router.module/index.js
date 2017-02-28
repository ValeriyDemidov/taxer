'use strict';

const utils = require('./services/util.js');

function _inject(server) {
  // appliance of server routes
  const routes = require('./routes');
  for (let title in routes) {
    if (!routes.hasOwnProperty(title)) continue;
    // 0 -- route
    // 1 -- method (`use` by default)
    const _split = title.split(' ').reverse();

    let handlersChain = (routes[title] instanceof Function) ? routes[title](server) : routes[title];
    if (!Array.isArray(handlersChain)) handlersChain = [handlersChain];
    const method = _split[1] || 'use';
    const uri = utils.addPrefix(_split[0]);
    server.log.info('Loading custom route:', method, uri);
    server[method].apply(server, [uri].concat(handlersChain));
  }
}

module.exports = {
  inject: _inject
};

'use strict';
  
module.exports = {
  inject() {
    global._inf = require('./_infrastructure');
    global.coreProxy = proxyName => _inf.getProxy(proxyName);
  }
};
'use strict';
module.exports = {
  getProxy: name => require(`./proxies/${name}`),
  getModel: name => require(`./data-sources/models/${name}`),
  getService: name => require(`./services/${name}`),
  getConstant: name => require(`./constants/${name}`),
  getConfig: name => require(`./configs/${name}`)
};

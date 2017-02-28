'use strict';
const config = require('./../../../configs/app');

module.exports = {
    addPrefix(route) {
        return '/' + config.apiPrefix + '/v' + config.version[0] + route;
    }
};

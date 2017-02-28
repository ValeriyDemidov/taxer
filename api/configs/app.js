'use strict';

// environment resolvation
module.exports = {
	// dev/prod/test
	environment: 'prod',
	port: 3333,
	apiPrefix: 'api',
	version: require('./../package.json').version
};

'use strict';

const mongoose = require('mongoose');
const dbConfig = require('./../../configs/mongo');
const ENV = require('./../../configs/app').environment;
const restifyMongoose = require('restify-mongoose');

// connecting to mongo pool uses automatically later
mongoose.connect(`mongodb://${dbConfig.host}/${dbConfig.database}`);

// loading all models
const normalizedPath = require('path').join(__dirname, 'models');
const models = require("fs").readdirSync(normalizedPath).map(file => require('./models/' + file));
const _publicModels = {};
const _publicResources = {};

module.exports = {
  inject: function (server) {
    // if environment is development or testing -- serve all models
    models.forEach(model => {
      const nameLowerCase = model.modelName.toLowerCase();
      const uri = `/api/v1/${nameLowerCase}`;
      const resource = restifyMongoose(model);

      _publicModels[nameLowerCase] = model;
      _publicResources[nameLowerCase] = resource;
      if (({dev:1, test:1})[ENV] ) {
        resource.serve(uri, server);
        server.log.info(`Serving model '${model.modelName}' in DEV mode to URI: ${uri}`);
      }
    });
  },
  public: {
    models: _publicModels,
    resources: _publicResources
  }
};

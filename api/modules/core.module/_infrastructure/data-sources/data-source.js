'use strict';

const parametersSpec = global._inf.getService('parameters-spec');
const logProvider = global._inf.getService('log-provider');

module.exports = class DataSource {
  constructor(params) {
    if (!params.model) {
      throw new Error('Attempting to instantiate data source without model.');
    }
    this.log = logProvider.createLogger(params.id || 'data-source');
    this._validator = parametersSpec.createValidator(params.model);
    // @todo: adapter assertion here
    this.adapter = params.adapter;
  }

  get(...args) {
    if (!this.adapter)
      return null;
    const data = this.adapter(...args);
    try {
      return this._validator.applyParameters(data);
    } catch (e) {
      this.log.error({ data, error: e.message }, 'Adopted data does not suite provided model');
      return null;
    }
  }
};

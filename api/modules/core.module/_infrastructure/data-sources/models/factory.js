'use strict';

const DataSource = require('./../data-source');
const DataSourceAggregator = require('./../aggregator');

module.exports = function (params) {
  const aggregator = new DataSourceAggregator();
  for (let model of params) {
    aggregator.add(new DataSource(model));
  }
  return aggregator;
};

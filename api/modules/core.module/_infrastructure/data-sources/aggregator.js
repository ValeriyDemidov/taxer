'use strict';

const DataSource = require('./data-source');

module.exports = class DataSourceAggregator {

  /**
   * Constructs data source aggregator instance
   */
  constructor () {
    this.sources = [];
  }

  /**
   * Process lookup of all aggregated data sources.
   * @param  {String} query -- data selection query
   * @return {Array}        -- array of data docs that satisfies `query`
   */
  get (query) {
    return this.sources.reduce((accum, src)=>{
      return accum.concat(src.get(query))
    }, []);
  }

  /**
   * Adds some data source to an aggregator
   * @param {DataSource} source -- data source to be aggregated
   */
  add (source) {
    if (!(source instanceof DataSource))
      throw new Error('Attempt of adding invalid source to DataSourceAggregator');
    this.sources.push(source);
  }
};

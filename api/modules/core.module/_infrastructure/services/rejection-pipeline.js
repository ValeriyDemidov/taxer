'use strict';

module.exports = pipeline => {
  return pipeline.reduce((accum, item) => {
    return accum || item();
  }, null);
};

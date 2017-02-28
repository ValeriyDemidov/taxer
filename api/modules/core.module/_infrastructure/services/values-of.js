'use strict';
module.exports = (object) => {
  const result = [];
  for (let prop in object)
    result.push(object[prop]);
  return result;
};

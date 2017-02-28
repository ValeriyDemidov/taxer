'use strict';

// Enum parameter class definition
class EnumClass {
  constructor() {
    this.supportable = {};
    for (let value of arguments) {
      this.supportable[value] = true;
    }
  }

  test(value) {
    return this.supportable[value] !== undefined;
  }

  list() {
    return `[${Object.keys(this.supportable).join(', ')}]`;
  }
}

// Validator class definition
class ParameterSpec {

  constructor(spec) {
    this.spec = spec;
  }

  validateParameter(param, value) {
    // null-type short definition alias
    if (this.spec[param] === null)
      this.spec[param] = { type: null };
    const sp = this.spec[param];
    // unknown parameter assertion
    if (sp === undefined)
      throw new Error(`Unknown parameter: '${param}'`);
    // required parameter assertion
    if (value === undefined && sp.required)
      throw new Error(`Parameter '${param} is required'`);
    // calculating values
    const wrapped = (sp.type && sp.raw) ? value : new Object(value);
    const p = (sp.type !== undefined) ? sp.type : sp;
    // console.log('--', p);
    // Enum test assertion
    if (p instanceof EnumClass) {
      if (!p.test(value))
        throw new Error(`'${param}' parameter must be one of ${p.list()}, '${value}:${typeof value}' is given`)
    // Type sufficiency assertion
    } else if ((p !== null) && (value !== null) && !(wrapped instanceof p)) {
      throw new Error(`'${param}' parameter must be a ${p.name}, '${wrapped.constructor.name}' is given`);
    }
    // If nothing thrown -- return value
    // console.log(param, ' --- ', value);
    return value;
  }

  applyParameters(params) {
    params = params || {};
    let result = {};
    for (let key in this.spec) {
      let defaultValue = null;
      if (this.spec[key] && this.spec[key].default !== undefined) {
        defaultValue = (this.spec[key].default instanceof Function) ?
          this.spec[key].default :
          JSON.parse(JSON.stringify(this.spec[key].default))
      }
      const value = (params[key] !== undefined) ? params[key] : defaultValue;
      let valid;
      if (valid = this.validateParameter(key, value))
        result[key] = valid;
    }
    return result;
  }
}

module.exports = {
  createValidator: spec=>new ParameterSpec(spec),
  Enum: EnumClass,
  dummyNone: function(){return null;},
  dummyTrue: function(){return true;},
  dummyFalse: function(){return false;}
}

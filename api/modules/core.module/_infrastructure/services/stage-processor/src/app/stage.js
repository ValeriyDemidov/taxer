'use strict';
var Promise = require('bluebird');

// validator importing
const ParameterSpec = global._inf.getService('parameters-spec');
const _validator = ParameterSpec.createValidator({
  name: String,
  autoTrigger: Boolean,
  bootstrap: Function,
  triggerCondition: {
    type: Function,
    default: ParameterSpec.dummyTrue
  },
  onStageEnter: {
    type: Function,
    default: ParameterSpec.dummyNone
  },
  onTrigger: {
    required: true,
    type: Function,
  },
  triggerCallback: {
    type: Function,
    default: ParameterSpec.dummyNone
  },
  onStageLeave: {
    type: Function,
    default: ParameterSpec.dummyNone
  },
  chainSwitcher: {
    type: Function,
    default: ()=>'default'
  },
  chain: {
    type: Object,
    default: {}
  },
  hypervisor: {
    type: null,
    required: true
  },
  model: Object,
  log: Object
});

// error emitters
function _errorInvalidStage() {
  return new Error('Attempting to chain invalid stage. `Stage` is expected.');}
function _errorInvalidStageName() {
  return new Error('Attempting to chain stage with invalid name. `String` is expected.');}
function _errorNoStageInScope() {
  return new Error('Attempting to chain stage that is out of hypervisors scope.');}

// stage class exporting
module.exports = class Stage {

  constructor(parameters) {
    this.$ = _validator.applyParameters(parameters);
    this.cache = {};
    if (this.$.bootstrap) this.$.bootstrap.call(this);
    if (this.$.log) this.log = this.$.log;
  }

  chain(...args) {
    const stage = args.pop();
    if (stage !== null && !(stage instanceof Stage))
      throw _errorInvalidStage();
    const name = args.pop() || 'default';
    if (!(new Object(name) instanceof String))
      throw _errorInvalidStageName();
    if (!this.$.hypervisor.haveStage(stage))
      throw _errorNoStageInScope();
    this.$.chain[name] = stage;
    return stage;
  }

  chainAll(spec) {
    // minimal for now
    for (let name in spec)
      this.chain(name, spec[name]);
  }

  trigger(parameters) {
    if (parameters === undefined) 
      parameters = {}; 
    if (this.$.triggerCondition !== null && !this.$.triggerCondition.apply(this, parameters))
      return;
    this.lock();

    Promise
      .resolve()
      .then(()=>this.$.onTrigger.call(this, parameters))
      .then(procResult=>{
        this.$.triggerCallback(procResult);
        // console.log('procResult:', this);
        const chainName = this.$.chainSwitcher.call(this, procResult);
        // console.log('chainName:', chainName, this.$.chain);
        if (!chainName) return void this.finalizeProcessing();
        const next = this.$.chain[chainName];
        if (!next) return void this.finalizeProcessing(null);
        Promise
          .join(this.leaveStageAsync(), next.enterStageAsync())
          .then(()=>{
            this.finalizeProcessing(next);
          });
      });
  }

  // ----------------------------------------------------------- private goes here
  enterStageAsync(parameters) {
    this.cache = {};
    return Promise
      .resolve(this.$.onStageEnter.call(this))
      .then(()=>{
        if (this.$.autoTrigger)
          this.trigger(parameters);
      })
  }

  leaveStageAsync() {
    return Promise
      .resolve(this.$.onStageLeave.call(this))
      .then(()=>{this.cache = null;});
  }

  // triggering lock helpers for async execution
  lock() {
    this.$.hypervisor.locked = true;
  }
  unlock() {
    this.$.hypervisor.locked = false;
  }

  // trigger finalizing function
  finalizeProcessing(chain) {
    chain = chain || this;
    this.$.hypervisor.activeStage = chain;
    this.unlock();
  }

  // returns stage name
  getName() {
    return this.$.name;
  }
};

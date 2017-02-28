'use strict';

const Stage = require('./stage');

module.exports = class StageProcessor {

  constructor(model) {
    this.model = model || {};
    this.stages = [];
    this.activeStage = null;
    this.locked = false;
  }

  createStage(spec) {
    spec.hypervisor = this;
    spec.model = this.model;
    let stage = new Stage(spec);
    this.stages.push(stage);
    return stage;
  }

  trigger(parameters) {
    if (!this.activeStage) {
      throw { name : 'InactiveProcessor', message : 'Can not trigger stage: inactive processor' } }
    if (this.locked) {
      throw { name : 'ProcessorInProgress', message : 'Can not trigger stage: another is in progress' } }
    if (!this.initiated) {
      this.activeStage.enterStageAsync();
      this.initiated = true;
    }
    this.activeStage.trigger(parameters);
    return true;
  }

  focusOn(stage) {
    if (!(stage instanceof Stage))
      throw new Error('Attempting to focus on invalid stage');
    this.activeStage = stage;
  }

  haveStage(stage) {
    return stage === null || this.stages.indexOf(stage) >= 0;
  }

  currentStage() {
    return (this.activeStage !== null) ?
      this.activeStage.getName() || 'unnamed' :
      'Chain is finished';
  }
};

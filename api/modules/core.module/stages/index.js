'use strict';

const StageProcessor = global._inf.getService('stage-processor');
const _createChildLogger = global._inf.getService('log-provider').createChildLogger;

const bootstrapStageSpec = require('./specs/bootstrap');
const dealingStageSpec = require('./specs/dealing');
const constructionStageSpec = require('./specs/construction');
const activityStageSpec = require('./specs/activity');
const deathStageSpec = require('./specs/death');

const _modifySpec = function(spec, table, name) {
  spec.log = _createChildLogger(table.log, {'stage' : name});
  if (table.motionCallback)
    spec.triggerCallback = table.motionCallback;
  return spec;
}

module.exports = {
  createProcessor: function (table) {
    let hypervisor = new StageProcessor({
      table: table,
      actors: table.players
    });

    const bootstrapStage    = hypervisor.createStage(_modifySpec(bootstrapStageSpec, table, 'bootstrap'));
    const dealingStage      = hypervisor.createStage(_modifySpec(dealingStageSpec, table, 'dealing'));
    const constructionStage = hypervisor.createStage(_modifySpec(constructionStageSpec, table, 'construction'));
    const activityStage     = hypervisor.createStage(_modifySpec(activityStageSpec, table, 'activity'));
    const deathStage        = hypervisor.createStage(_modifySpec(deathStageSpec, table, 'death'));
    
    hypervisor.focusOn(bootstrapStage);
    bootstrapStage
      .chain(dealingStage)
      .chain(constructionStage)
      .chain(activityStage)
      .chain(deathStage)
      .chainAll({
        loop : dealingStage,
        result: null
      });

    return hypervisor;
  }
}

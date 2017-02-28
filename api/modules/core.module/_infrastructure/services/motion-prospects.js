'use strict';

const log = global._inf.getService('fallback-logger');
const merge = global._inf.getService('objects/merge');
const resolveTargets = global._inf.getService('targets-resolver');
const checkAssaultPossibility = global._inf.getService('assault-checker');

const PROSP = global._inf.getConstant('prospections');
const STAGE = global._inf.getConstant('stages');
const TARGET = global._inf.getConstant('targets');

let abilityProxy = null;
let playerProxy = null;
let animalProxy = null;
let tableProxy = null;
let cardProxy = null;

function loadInfrastructure() {
  abilityProxy = global._inf.getProxy('ability');
  playerProxy = global._inf.getProxy('player');
  animalProxy = global._inf.getProxy('animal');
  tableProxy = global._inf.getProxy('table');
  cardProxy = global._inf.getProxy('card');
  loadInfrastructure = function(){};
}

const _prospect = (type, parameters) => {
  return { type, parameters }
};

function _getTableProspects (tableId) {
  const table = tableProxy.get(tableId);
  if (!table) return;
  let _ctx = {
    stage: table.getCurrentStage(),
    players: table.listPlayers()
  };
  let perPlayerProspects = table.listPlayers().map(playerId => _getPlayerProspects(playerId, _ctx));
  return [].concat.apply([], perPlayerProspects);
}

function _getPlayerProspects (playerId, context) {
  const player = playerProxy.get(playerId);
  if (!player) return;
  if (!~PROSP.STAGES.indexOf(context.stage))
    return void log.error({ playerId, context }, 'Can`t collect player prospects: inactive stage');

  const _targetingType = (context.stage === STAGE.CONSTRUCTION) ? 'usage' : 'trigger';
  let prospects = [_prospect(PROSP.TYPES.PASS)];
  if (context.stage == STAGE.CONSTRUCTION) {
    player.listHand().forEach(cardId => {
      const targeting = cardProxy.get(cardId).getTargeting(_targetingType);
      prospects.push(_prospect(PROSP.TYPES.INITIATE, {
        card: cardId
      }));
      var constructionTargets = resolveTargets.card(context.players, playerId, targeting);
      if (!constructionTargets.length) return;
      prospects.push(_prospect(PROSP.TYPES.CONSTRUCT, {
        card: cardId,
        targets: constructionTargets
      }));
    });
  } else if (context.stage == STAGE.ACTIVITY) {
    const _ctx = merge(context, {
      actor: playerId
    });
    prospects = prospects.concat(
      player.listAnimals().map(animalId => _getAnimalProspects(animalId, _ctx)));    
  }

  return prospects;
}

function _getAnimalProspects (animalId, context) {
  const animal = animalProxy.get(animalId);
  if (!animal) return;
  let prospects = [];

  // check feeding possibility
  if (animal.haveFoodCapacities()) {
    prospects.push(_prospect(PROSP.TYPES.FEED, {
      amount: 1
    }));
  }
  // check possible assaults
  context.players.forEach(playerId => playerProxy.get(playerId).listAnimals().forEach(victimId => {
    if (victimId === animalId) return;
    if (checkAssaultPossibility(animalId, victimId)) {
      prospects.push(_prospect(PROSP.TYPES.ASSAULT, {
        animal: animalId,
        target: victimId
      }));
    }
  }));
  // check possible casts
  animal.getAbilities().forEach(abilityTitle => {
    const targeting = abilityProxy.get(abilityTitle).triggerTargeting;
    if (!targeting) return;
    prospects.push(_prospect(PROSP.TYPES.CAST, {
      animal: animalId,
      ability: abilityTitle,
      targets: resolveTargets.animal(context.players, context.actor, animalId, targeting)
    }));
  });
  
  return prospects;
}

module.exports = tableId => {
  loadInfrastructure();
  return _getTableProspects(tableId);
};

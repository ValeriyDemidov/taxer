 'use strict';

const TARGETS = global._inf.getConstant('targets');
const STAGES = global._inf.getConstant('stages');
const playerProxy = global._inf.getProxy('player');

/**
 * Returns list of possible target animals according to passed parameters
 * Considering that current game stage is STAGES.ACTIVITY
 * @param  {Array}  playersHaystack -- list of players to lookup throught
 * @param  {string} emitter         -- id of motion-emitting player
 * @param  {string} animal          -- id of caster animal
 * @param  {number} targeting       -- targets to list
 * @return {Array}                  -- list of potential target animals
 */
function _getAnimalTargeting(playersHaystack, emitter, animal, targeting) {
  let result = [];
  // if self-targeting is required -- return only yourself
  if (targeting == TARGETS.self) {
    return [animal];
  }

  playersHaystack.forEach(playerId => {
    // if targeting is allied -- choose only yourself
    if ((targeting == TARGETS.ally || targeting == TARGETS.self) && playerId != emitter) return;
    // if targeting is opposite -- choose only other players
    if (targeting == TARGETS.enemy && playerId == emitter) return;

    const animals = playerProxy.get(playerId).listAmimals();
    animals.forEach(function(animalId) {
      if (targeting == TARGETS.other && animalId == animal) return;
      result.push(animalId);
    });
  });  

  return result;
}

/**
 * Returns list of possible target animals according to passed parameters
 * Considering that current game stage is STAGES.CONSTRUCTION
 * @param  {Array}  playersHaystack -- list of players to lookup throught
 * @param  {string} emitter         -- id of motion-emitting player
 * @param  {number} targeting       -- targets to list
 * @return {Array}                  -- list of potential target animals
 */
function _getCardTargeting(playersHaystack, emitter, targeting) {
  let result = [];

  playersHaystack.forEach(playerId => {
    // if targeting is allied -- choose only yourself
    if ((targeting == TARGETS.ally || targeting == TARGETS.self) && playerId != emitter) return;
    // if targeting is opposite -- choose only other players
    if ((targeting == TARGETS.enemy || targeting == TARGETS.other) && playerId == emitter) return;
    
    result = result.concat(playerProxy.get(playerId).listAnimals());
  });

  return result;
}

module.exports = {
  animal: _getAnimalTargeting,
  card: _getCardTargeting
};

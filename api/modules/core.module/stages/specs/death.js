'use strict';

const animalProxy = global._inf.getProxy('animal');

/**
 * DEATH STAGE
 */

// Responsible for curses processing
function _preprocessDeath() {
  // @todo: calculate all alive animals here (or somewhere)
  // @todo: curses processing here
}

// Animals array lookup
// Executing death where needed
function _processDeath() {
  const animals = this.$.model.animals;
  for (let animalId of animals) {
    let anm = animalProxy.get(animalId);
    if (anm.deathTrigger || !anm.isFed()) 
      anm.die();
  }
}

// hz poka nicho
function _postprocessDeath() {
  
}

module.exports = {
  name: 'death',
  autoTrigger: true,
  onStageEnter: _preprocessDeath,
  onTrigger: _processDeath,
  onStageLeave: _postprocessDeath
};

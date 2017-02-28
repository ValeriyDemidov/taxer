'use strict';

const animalProxy = global._inf.getProxy('animal');
const log = global._inf.getService('fallback-logger');

/**
 * Assault attemption checker function
 * Checks if `assault` can try to bite `victim`
 * @param  {string} assault -- offencive animal id
 * @param  {string} victim  -- defencive animal id
 */
module.exports = function (assault, victim) {
    var assaultEntity = animalProxy.get(assault);
    var victimEntity = animalProxy.get(victim);
    // parameters validation
    if (!assaultEntity || !victimEntity) {
        log.error({assault, victim}, 'Assault checker failed: invalid animal ID');
        return false;
    }
    
    // blockers checking loop
    var blockers = victimEntity.getBlockers();
    for (let bl of blockers) {
        if (bl instanceof Function) {
            // @todo: implement blocker function parameters @id6
            if (!bl.call()) return false;
        } else {
            if (!assaultEntity.hasBooster(bl)) return false;
        }
    }

    return true;
}

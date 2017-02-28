'use strict';

const StageProcessor = require('./app/stage-processor');
const hypervisor = new StageProcessor();

let stg = hypervisor.createStage({
  bootstrap : function() {
    console.log('bootstrapped 2');
    this.name = 'Adin';
  },
  onTrigger : function(msg, go) {
    console.log('triggered well with', go, msg);
  },
  onStageLeave : function() {
    const name = this.name;
    console.log('StageLeft', name);
  },
  hypervisor: {}
});

let stg2 = hypervisor.createStage({
  bootstrap : () => {
    console.log('bootstrapped 1');
    this.name = 'Dva';
  },
  autoTrigger: true,
  onTrigger : function(msg, go) {
    console.log('autotrigger fired');
  },
  onStageEnter : function() {
    console.log('StageEntered');
  },
  hypervisor: {}
});

stg.chain(stg2);

stg.trigger('YOOO', 'Go');
// stg2.trigger('YOOO', 'Go');


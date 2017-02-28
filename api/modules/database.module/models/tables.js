'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema definition
const _schema = new Schema({
  title:  String,
  players: [{type: Schema.Types.ObjectId, ref: 'Player'}],
  status: {
    type: String,
    default: 'lobby',
    enum: ['lobby', 'active', 'stalled', 'over']
  }
});

// schema methods
_schema.methods.start = function () {
  this.status == 'lobby' && (this.status = 'active');
};
_schema.methods.stall = function () {
  this.status == 'active' && (this.status = 'stalled');
};
_schema.methods.resume = function () {
  this.status == 'stalled' && (this.status = 'active');
};
_schema.methods.stop = function () {
  this.status = 'over';
};

// model compiling
var Table = mongoose.model('Table', _schema);
module.exports = Table;

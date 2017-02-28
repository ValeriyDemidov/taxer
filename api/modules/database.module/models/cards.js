'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema definition
const _schema = new Schema({
  title:  String,
  base: {type: Schema.Types.ObjectId, ref: 'Ability'},
  modifyer: {type: Schema.Types.ObjectId, ref: 'Ability'}
});

// model compiling
var Card = mongoose.model('Card', _schema);
module.exports = Card;

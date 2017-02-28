'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// child schema definition
const _handlersSchema = new Schema({
  onAnimalDecorated: String,
  onAnimalUndecorated: String
});

// schema definition
const _schema = new Schema({
  title:  String,
  multiple: Boolean,
  paired: Boolean,
  cooldown: 0,
  usageTargeting: Number,
  triggerTargeting: Number,
  foodBoost: Number,
  boosts: [String],
  blockers: [String],
  processingCondition: String,
  processor: String, 
  handlers: _handlersSchema
});

// model compiling
var Ability = mongoose.model('Ability', _schema);
module.exports = Ability;

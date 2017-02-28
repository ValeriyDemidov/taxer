'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema definition
const _schema = new Schema({
  name:  String
});

// model compiling
var Player = mongoose.model('Player', _schema);
module.exports = Player;

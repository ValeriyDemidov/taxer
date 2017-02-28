'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema definition
const _schema = new Schema({
  title:  String,
  owner: {type: Schema.Types.ObjectId, ref: 'Player'},
  cards: [{type: Schema.Types.ObjectId, ref: 'Card'}]
});

// model compiling
var Deck = mongoose.model('Deck', _schema);
module.exports = Deck;

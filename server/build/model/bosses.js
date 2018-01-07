'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BossSchema = new Schema({
	name: { type: String, required: true },
	tier: { type: Number, required: true }
}, { collection: 'raid_bosses' });

module.exports = mongoose.model('Boss', BossSchema);
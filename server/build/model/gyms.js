'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GymsSchema = new Schema({
	name: { type: String, min: 1, max: 999, required: true },
	address: { type: String, max: 999 },
	landmark: { type: String, max: 999 },
	gmap: { type: String, max: 999 },
	aliases: [String],
	is_ex_eligible: { type: Boolean }
});

GymsSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Gym', GymsSchema);
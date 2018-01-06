'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RaidsSchema = new Schema ({
	gym: { type: Schema.Types.ObjectId, ref: 'Gym', required: true },
	boss: { type: Schema.Types.ObjectId, ref: 'Boss', required: true },
	start_time: { type: Date, required: true },
});

module.exports = mongoose.model('Raid', RaidsSchema);
'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogsSchema = new Schema ({
	user_id: { type: String, required: true },
	params: { type: String },
	insert_date: { type: Date, required: true },
	is_success: { type: Boolean, required: true }
});

module.exports = mongoose.model('Log', LogsSchema);
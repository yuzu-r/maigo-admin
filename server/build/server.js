'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
var router = express.Router();
var port = process.env.PORT || 8080;

//var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pogo';
var mongoURI = process.env.DB_CONNECTION;
var serverID = process.env.SERVER_ID;
var Gym = require('./model/gyms');
var Boss = require('./model/bosses');
var Raid = require('./model/raids');
var Log = require('./model/logs');

var stringToBoolean = require('./helpers/utilities.js');

console.log('mongo connect: ', mongoURI);
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.route('/raids').get(function (req, res) {
	Raid.find({}).populate('gym', 'name').populate('boss').exec(function (err, raids) {
		if (err) {
			return res.status(400).json({
				success: false,
				message: 'Unable to retrieve raids ' + err
			});
		}
		return res.status(200).json({ success: true, raids: raids });
	});
});

router.route('/gyms').get(function (req, res) {
	Gym.find(function (err, gyms) {
		if (err) {
			return res.status(400).json({
				success: false,
				message: 'Unable to retrieve gyms ' + err
			});
		}
		return res.status(200).json({ success: true, gyms: gyms });
	});
}).post(function (req, res) {
	var gym = new Gym();
	gym.name = req.body.name;
	gym.address = req.body.address;
	gym.landmark = req.body.landmark;
	gym.aliases = req.body.aliases;
	gym.gmap = req.body.gmap;
	req.body.is_ex_eligible ? gym.is_ex_eligible = stringToBoolean(req.body.is_ex_eligible) : null;

	gym.save(function (err) {
		if (err) {
			console.log('error in creating gym');
			if (err.name === 'MongoError' && err.code === 11000) {
				// duplication error
				return res.status(409).json({
					success: false,
					message: 'Error saving gym to DB - duplicate gym ' + err
				});
			} else {
				return res.status(400).json({
					success: false,
					message: 'Error, gym not created ' + err
				});
			}
		}
		return res.status(200).json({ message: 'gym successfully added', success: true });
	});
});
router.route('/gyms/:gym_id').put(function (req, res) {
	Gym.findById(req.params.gym_id, function (err, gym) {
		if (err) {
			return res.status(400).json({ success: false, message: 'Cannot find gym to update' });
		}
		req.body.name ? gym.name = req.body.name : null;
		req.body.address ? gym.address = req.body.address : null;
		req.body.gmap ? gym.gmap = req.body.gmap : null;
		req.body.landmark ? gym.landmark = req.body.landmark : null;
		if (req.body.aliases) {
			let squashedAliases = [];
			for (let g of req.body.aliases) {
				g && squashedAliases.push(g);
			}
			gym.aliases = squashedAliases;
		}
		// careful, don't edit if not present in request
		req.body.is_ex_eligible ? gym.is_ex_eligible = stringToBoolean(req.body.is_ex_eligible) : null;
		gym.save(function (err) {
			if (err) {
				if (err.name === 'MongoError' && err.code === 11000) {
					// duplication error
					return res.status(409).json({
						success: false,
						message: 'Error saving gym to DB - duplicate gym ' + err
					});
				} else {
					return res.status(400).json({
						success: false,
						message: 'Error, gym not created ' + err
					});
				}
			}
			return res.status(200).json({ message: 'Gym successfully updated', success: true });
		});
	});
}).delete(function (req, res) {
	Gym.remove({ _id: req.params.gym_id }, function (err, gym) {
		if (err) {
			return res.status(400).json({
				success: false,
				message: 'Error deleting gym ' + err
			});
		}
		return res.status(200).json({ success: true, message: 'gym was deleted' });
	});
});

router.route('/logs').get(function (req, res) {
	let query = { server_id: serverID };
	if (req.query.command) {
		query.command = req.query.command;
	}

	Log.find(query).exec(function (err, logs) {
		if (err) {
			return res.status(400).json({
				success: false,
				message: 'Unable to retrieve logs ' + err
			});
		}
		return res.status(200).json({ success: true, logs: logs });
	});
});

router.route('/lookups').get(function (req, res) {
	Log.find({ 'server_id': serverID, 'command': 'whereis' }, { '_id': 0, 'server_id': 0, 'command': 0 }).sort({ 'insert_date': 1 }).exec(function (err, lookups) {
		if (err) {
			return res.status(400).json({
				success: false,
				message: 'Unable to retrieve lookups ' + err
			});
		}
		return res.status(200).json({ success: true, lookups: lookups });
	});
});

// Serve static files from the React app
var staticFiles = express.static(path.join(__dirname, '../../client/build'));
app.use(staticFiles);
//Use our router configuration when we call /api
app.use('/api', router);
app.use('/*', staticFiles);
//starts the server and listens for requests
app.listen(port, function () {
	console.log(`api running on port ${port}`);
});
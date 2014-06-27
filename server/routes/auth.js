var debug = require('debug')('pook:routes:auth');

var async = require('async');
var express = require('express');
var formidable = require('formidable');

var User = require('../common/User.js');

// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
// passport.use( new LocalStrategy(function (email, password, done) {
// 	async.waterfall([
// 		function findUser(cb) {
// 			User.findByEmailPassword(email, password, cb);
// 		},
// 		function gotUser(userId, cb) {
// 			done(null, userId);
// 			cb();
// 		}
// 		],
// 		function complete(err) {
// 			if (err) {
// 				done(err, false, err.formMessages);
// 			}
// 		}
// 	);

// }));

var COOKIE_ID = 'pookio_user';
var HOUR = 60 * 60 * 1000;

function login(res, userId) {
	res.cookie(COOKIE_ID, userId, {
		signed: true, 
		maxAge: 24 * HOUR, // 24 hours
		httpOnly: true});
}

function logout(res) {
	res.clearCookie(COOKIE_ID);
}

var router = express.Router();

router.post('/login', function(req, res, next) {

	async.waterfall([
			function parseForm(cb) {
				var form = new formidable.IncomingForm();
				form.parse(req, cb);
			},
			function authenticate(fields, files, cb) {
				User.findByEmailPassword(fields.email, fields.password, cb);
			},
			function setCookie(userId, cb) {
				login(res, userId);
				res.send(200, { data: { id: userId } });
			}
		],
		function complete(err) {
			if (err) {
				res.send(422, {
					errMsg: err.message,
					formMessages: err.formMessages
				});				
			}
		});
});

router.post('/logout', function(req, res, next) {
	logout(res);
	res.send(200, { data: {}})
});

router.post('/register', function(req, res, next ) {

	var userId;

	async.waterfall([
		function parseForm(cb) {
			var form = new formidable.IncomingForm();
			form.parse(req, cb);
		},
		function createUser(fields, files, cb) {
			User.create(fields.email, fields.password, cb);
		},
		function getUserId(inUserId, cb) {
			userId = inUserId;
			login(res, userId);
			debug("user created", userId);
			res.send(200, { data: { id: userId } });
			cb();
		}
		],
		function complete(err) {
			if (err) {
				debug("error creating user", err);
				res.send(422, {
					errMsg: err.message,
					formMessages: err.formMessages
				});		
			}
		}
	);
});


module.exports = {
	router: router
}

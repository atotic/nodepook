var debug = require('debug')('pook:routes:auth');

var async = require('async');
var express = require('express');
var formidable = require('formidable');

var AWSu = require('../common/aws_util.js');
var User = require('../common/User.js');

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

router.get('/logout', function(req, res, next) {
	logout(res);
	if (req.xhr)
		res.send(200, { data: {}})
	else
		res.redirect('/');
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

// 
function loadUserFromCookie(req, res, next) {
	var userId = req.signedCookies.pookio_user;
	if (userId) {
		User.read(userId, function(err, user) {
			req.user = user;
			next(err);
		});
	}
	else
		next();
}

module.exports = {
	router: router,
	loadUserFromCookie: loadUserFromCookie
}

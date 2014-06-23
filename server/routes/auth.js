var debug = require('debug')('pook:routes:auth');

var async = require('async');
var bcrypt = require('bcrypt');
var express = require('express');
var formidable = require('formidable');
var localStrategy = require('passport-local').Strategy;
var passport = require('passport');

var userModel = require('../common/user_model.js');

/**
 * User model
 *
 * fields:
 * email
 * password: encrypted with bcrypt
 */
var User = {
	create: function(email, password, done) {

	}
}

var router = express.Router();
router.post('/login', function(req, res, next) {
});

router.post('/register', function(req, res, next ) {
	var form = new formidable.IncomingForm();
	var userId;
	async.waterfall([
		function parseForm(cb) {
			form.parse(req, cb);
		},
		function createUser(fields, files, cb) {
			userModel.create(fields.email, fields.password, cb);
		},
		function(inUserId, cb) {
			userId = inUserId;
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
		else {
			debug("user created", userId);
			res.send(200, { data: { id: userId } });
		}
	});
});
module.exports = router;

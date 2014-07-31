// user_model.js
/**
 * User model
 *
 * fields:
 * email
 * password: encrypted with bcrypt
 */
"use strict";
var debug = require('debug')('pook:lib:user_model');

var async = require('async');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var AWSu = require('./aws_util');


/**
 * @param errorMessages = { 
 *   message: "main error message", // optional
 *	 fieldName: "error text"  // for each field
 * }
 */
function UserModelError(message, formMessages) {
	var err = new Error(message);
	err.name = "UserModelError";
	err.formMessages = formMessages;
	return err;
}

// done(err, encrypted_pass)
function encryptPassword(password, done) {
	async.waterfall([
			function generateSalt(cb) {
				bcrypt.genSalt(SALT_WORK_FACTOR, cb);
			},
			function hash(salt, cb) {
				bcrypt.hash(password, salt, cb);
			}
		],
		function(err, pw) {
			done(err, pw);
		});
}


// done(err, userId)
var CANT_CREATE_MSG = "User cannot be registered.";
function create(email, password, done) {
	if (!email || !email.match('@'))
		return done( new UserModelError(CANT_CREATE_MSG, {email: "Invalid address"}) );
	if (!password || password.length < 8)
		return done( new UserModelError(CANT_CREATE_MSG,  { password: "Password is too short"}));

	var userId;
	async.waterfall([
			function(cb) {
				findByEmail(email, cb);
			},
			function encryptPw(awsResponse, cb) {
				if ('Items' in awsResponse && awsResponse.Items.length > 0) {
					return cb( new UserModelError(CANT_CREATE_MSG,  { email: "email already registered"}));
				}
				debug('encryptPw');
				encryptPassword(password, cb);
			},
			function saveToDb(encryptedPw, cb) {
				debug('saveToDb', userId);
				userId = AWSu.uniqueId;
				AWSu.sdb.putAttributes( {
					DomainName: AWSu.domains.users,
					ItemName: userId,
					Attributes: AWSu.objectToAttributes( {
						email: email, 
						password: encryptedPw
					} )					
				}, cb);
			}
		],
		function complete(err, result) {
			debug('createUser complete', err);
			done(err, userId);
		});
}

/** @callback done(err, userJs) */
function read(userId, done) {
	AWSu.sdbReadItem(AWSu.domains.users, userId, done);
}

function findByEmail(email, done) {
	AWSu.sdb.select( {
		SelectExpression: 'select itemName() from ' + AWSu.domains.users + ' where email=' + AWSu.quoteForSelect(email),
		ConsistentRead: true
	},
	done);	
}

/**
 * @callback done(err, userId)
 */
function findByEmailPassword(email, password, done) {
	var userId;
	async.waterfall([
			function findByEmail(cb) {
				debug('findByEmail');
				AWSu.sdb.select( {
					SelectExpression: 'select password from ' + AWSu.domains.users + ' where email=' + AWSu.quoteForSelect(email),
					ConsistentRead: true
				},
				cb);
			},
			function matchPassword(awsResponse, cb) {
				if ('Items' in awsResponse && awsResponse.Items.length > 0) {
					if (awsResponse.Items.length > 1)
						console.error("Many users with same email ", email, " ", awsResponse.Items.length);
					var item = AWSu.attributesToObject( 
						awsResponse.Items[0].Attributes, 
						awsResponse.Items[0].Name);
					userId = item.itemId;
					bcrypt.compare(password, item.password, cb);
				}
				else {
					debug('could not find user by email', email);
					cb( new UserModelError("No such user", { email: "email is not registered"}));
				}
			},
			function haveMatch(isMatch, cb) {
				if (isMatch)
					return cb(null, userId);
				else
					cb(new UserModelError("Invalid password", { password: "password does not match"}));
			}
		],
		function(err, userId) {
			done(err, userId);
		});
}

module.exports = {
	encryptPassword: encryptPassword,
	findByEmailPassword: findByEmailPassword,
	create: create,
	read: read
}

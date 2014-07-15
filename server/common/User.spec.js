// user_model.spec.js

var assert = require("chai").assert;
var async = require("async");

var User = require('./User.js');
var AWSu = require('./aws_util.js');
var util = require('./util.js');

describe('user_model', function() {

	it ("#encryptPassword", function(done) {
		User.encryptPassword("test", function(err, newPw) {
			assert.isUndefined(err, 'expect no error');
			assert(newPw.length > 10, "pw is long enough");
			done();
		});
	});

	it ('#create, duplicateCreate, findByEmailPassword', function(done) {
		this.timeout(10*1000);
		var email = 'test@totic.org';
		var password = '23423#@$34545sdf';
		var userId;
		async.waterfall([
				function createUser(cb) {
					User.create(email, password, cb);
				},
				function createDuplicateUser(id, cb) { // fails, can't create two users with same email
					userId = id;
					User.create(email, password, util.invertCallback(cb));
				},
				function readUser(id, cb) {
					AWSu.sdbReadItem(AWSu.domains.users, userId, cb);
				},
				function findByEmailPassword(user, cb) {
					assert(user.email == email, "stored email matches");
					// cb(null, userId);
					User.findByEmailPassword(email, password, cb);
				},
				function deleteUser(id, cb) {
					assert(userId == id, "found by email match");
					AWSu.sdb.deleteAttributes( {
						DomainName: AWSu.domains.users,
						ItemName: userId
					}, cb);
				}
			],
			function(err, result) {
				done(err, result);
			}
		);
	});

});

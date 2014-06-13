// user_model.spec.js

var assert = require("chai").assert;
var async = require("async");

var userModel = require('./user_model.js');
var AWSu = require('./aws_util.js');
var util = require('./util.js');

describe('user_model', function() {

	it ("#encryptPassword", function(done) {
		userModel.encryptPassword("test", function(err, newPw) {
			assert.isUndefined(err, 'expect no error');
			assert(newPw.length > 10, "pw is long enough");
			done();
		});
	});

	it ('#create, duplicateCreate, findByEmailPassword', function(done) {
		this.timeout(10*1000);
		var email = 'test@test.com';
		var password = '234sdf"@!##!@#';
		var userId;
		async.waterfall([
				function createUser(cb) {
					userModel.create(email, password, cb);
				},
				function createDuplicateUser(id, cb) {
					userId = id;
					userModel.create(email, password, util.invertCallback(cb));
				},
				function readUser(id, cb) {
					AWSu.sdbReadItem(AWSu.domains.users, userId, cb);
				},
				function findByEmailPW(user, cb) {
					assert(user.email == email, "stored email matches");
					// cb(null, userId);
					userModel.findByEmailPassword(email, password, cb);
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

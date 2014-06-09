// util_test.js
var debug = require('debug')('pook:test:util_test');

var assert = require("assert");
var path = require('path');
var fs = require('fs');
var async = require('async');

var util = require ('../common/util.js');

var datadir = path.resolve(__dirname, '../../test/data');
var src = path.join(datadir, 'tiny.jpg');

describe('util.js', function() {

	it ('#fileMd5', function(done) {
		util.fileMd5(src, done);
	});

	it('#fileMd5:error', function(done) {
		util.fileMd5('crap', function(err, md5) {
			if (err)
				done();
			else
				done(new Error("Read md5 of non existent file"));
		});
	});

	it('#hostIp', function(done) {
		async.seq(
			util.hostIp,
			function(ip, fn) {
				if (!ip.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/)) 
					fn(new Error("Bad ip " + ip));
				else
					fn(); 
			}
		)( function(err, result) {
			done(err);
		} );
	});
});

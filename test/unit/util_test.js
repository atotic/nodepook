// util_test.js
var assert = require("assert");
var path = require('path');
var promise = require('promised-io/promise');
var fs = require('promised-io/fs');

var util = require ('../../lib/util.js');

var src = path.resolve(__dirname, '../data/tiny.jpg');

describe('util.js', function() {

	it ('#fileMd5', function() {
		return util.fileMd5(src);
	});

	it('#fileMd5:error', function() {
		return util.invertPromise( util.fileMd5('crap'));
	});

	it('#hostIp', function() {
		var ip = util.hostIp();
		assert(ip.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/));
	});
});

// util_test.js
var assert = require("assert");
var path = require('path');
var promise = require('promised-io/promise');
var fs = require('promised-io/fs');

var utils = require ('../../lib/util.js');

var src = path.resolve(__dirname, '../data/tiny.jpg');

describe('util.js', function() {

	it ('#fileMd5', function() {
		return utils.fileMd5(src);
	});

	it('#fileMd5:error', function() {
		return utils.invertPromise( utils.fileMd5('crap'));
	});
});

// db_test.js
// util_test.js
var assert = require("assert");
var path = require('path');
var promise = require('promised-io/promise');
var fs = require('promised-io/fs');

var photoUtil = require ('../../lib/photo_util.js');
var db = require('../../lib/db.js');

var src = path.resolve(__dirname, '../data/orient3.jpg');

describe('db.js', function() {

	it ('#createPhoto', function() {
		return promise.seq([
			function() { return photoUtil.readExifData( src ) },
			function(exif) { 
				exif.displayName = "orient3.jpg";
				return db.photo.create(src, exif, null)
			}
			]);
	});

});


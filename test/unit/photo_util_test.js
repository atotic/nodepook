// photo_test.js
var assert = require("assert");
var path = require('path');
var promise = require('promised-io/promise');
var fs = require('promised-io/fs');

var photo = require("../../lib/photo_util.js");
var utils = require("../../lib/util.js");

var testPath = path.resolve(__dirname,'../data/orient6.jpg');

describe('photo_util.js', function() {
	it ('#autoRotate', function() {
		var src = testPath;
		var dest = path.resolve(__dirname, '../data/rotatetest.jpg');
		// return utils.fileCopy(src, dest);
		var sequence = promise.seq([
		 	function() { return utils.fileCopy(src, dest) }, // setup
		 	function() { return photo.autoRotate(dest) },
		 	function() { return fs.unlink(dest) }	// cleanup
			]);
		return sequence;
	});

	it ('#autoRotate fail', function() {
		return utils.invertPromise( photo.autoRotate('/badpath'));
	});

	it ('#readExifData', function() {
		var src = testPath;
		var deferred = new promise.Deferred();
		promise.when( photo.readExifData(src), 
			function(exifData) { 
				if ('width' in exifData) 
					deferred.resolve();
				else
					deferred.reject(new Error("no exif data")); 
			},
			function(err) { deferred.reject(err) }
		);
		return deferred.promise;
	});

	it ('#readExifData no width', function() {
		var src = path.resolve(__dirname,'../data/noexif.jpg');
		var deferred = new promise.Deferred();
		promise.when( photo.readExifData(src), 
			function(exifData) { 
				if ('width' in exifData) 
					deferred.resolve();
				else
					deferred.reject(new Error("no exif data")); 
			},
			function(err) { deferred.reject(err) }
		);
		return deferred.promise;
	});
});

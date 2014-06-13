// photo_test.js
var async = require("async");
var fs = require('fs');
var path = require('path');

var photo = require("./photo_util.js");
var utils = require("./util.js");

var datadir = path.resolve(__dirname, '../../test/data');
var testPath = path.join(datadir,'orient6.jpg');

describe('photo_util.js', function() {
	it ('#autoRotate', function(done) {
		var src = testPath;
		var dest = path.join(datadir, 'rotatetest.jpg');
		async.series([
				function(fn) { utils.fileCopy( src, dest, fn)},
				function(fn) { photo.autoRotate( dest, fn) },
				function(fn) { fs.unlink(dest, fn)}
			],
			function(err, result) {
				done(err);
			});
	});

	it ('#autoRotate fail', function(done) {
		photo.autoRotate('/badpath', function(err) {
			if (err)
				done();
			else
				done(new Error("Why did you rotate invisible file"));
		});
	});

	it ('#readExifData', function(done) {
		var src = testPath;
		photo.readExifData(src, function(err, exif) {
			if (err)
				done(err);
			else
				if ('width' in exif)
					done();
				else
					done(new Error('did not get width in exif'));
		});
	});

	it ('#readExifData no width', function(done) {
		var src = path.join(datadir,'noexif.jpg');
		photo.readExifData( src, function(err, exif) {
			if (err)
				done(err);
			else
				if ('width' in exif) 
					done();
				else
					done(new Error('did not get width in exif'));
		});
	});

});

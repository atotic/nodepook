// photo_test.js
var async = require("async");
var debug = require('debug')('pook:server:Photo');
var fs = require('fs');
var path = require('path');

var AWSu  = require('./aws_util.js');
var Photo = require("./Photo.js");
var utils = require("./util.js");

var datadir = path.resolve(__dirname, '../../test/data');
var testPath = path.join(datadir,'orient6.jpg');

describe('Photo.js image manipulation', function() {
	it ('#autoRotate', function(done) {
		var src = testPath;
		var dest = path.join(datadir, 'rotatetest.jpg');
		async.series([
				function(fn) { utils.fileCopy( src, dest, fn)},
				function(fn) { Photo.autoRotate( dest, fn) },
				function(fn) { fs.unlink(dest, fn)}
			],
			function(err, result) {
				done(err);
			});
	});

	it ('#autoRotate fail', function(done) {
		Photo.autoRotate('/badpath', function(err) {
			if (err)
				done();
			else
				done(new Error("Why did you rotate invisible file"));
		});
	});

	it ('#readExifData', function(done) {
		var src = testPath;
		Photo.readExifData(src, function(err, exif) {
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
		Photo.readExifData( src, function(err, exif) {
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

describe('Photo.js s3', function() {
	it('#uploadToS3/deleteFromS3', function(done) {
		this.timeout(30*1000);
		var src = path.resolve(__dirname, '../../test/data/tiny.jpg');
		Photo.uploadToS3(src, 'image/jpg', function(err, s3id) {
			if (err)
				done(err);
			else {
				Photo.deleteFromS3(s3id, done);
			}
		});
	});
});


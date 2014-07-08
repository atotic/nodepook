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

describe('Photo.js', function() {
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

describe('Photo.js crud', function() {
	it ('#createPhoto', function(done) {
		this.timeout(30 * 1000);
		var src = path.resolve(__dirname, '../../test/data/orient3.jpg');
		async.waterfall(
			[
				function readExif(cb) {
					Photo.readExifData(src, cb);
				},
				function createPhoto(exif, cb) {
					exif.displayName = "orient3.jpg";
					debug("creating photo");
					Photo.create(src, exif, 0, function(err, data) {
						if (err && err.name == 'DuplicatePhoto')
							Photo.delete(err.id, cb);
						else
							cb(err, data);
					});
				},
				function readPhoto(item, cb) {
					debug('reading photo', item.sdbId);
					if (item.s3id == null)
						cb( new Error("Photo was a duplicate " + item.sdbId));
					else
						Photo.read(item.sdbId, cb);
				},
				function deletePhoto(data, cb) {
					debug('deleting photo', data.itemId);
					Photo.delete( data.itemId, cb);
				}
			],
			done
		);
	});

});

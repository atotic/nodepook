// db_test.js
// util_test.js
var debug = require('debug')('pook:test:db_test');

var async = require('async');
var fs = require('fs');
var path = require('path');

var photoUtil = require ('./photo_util.js');
var db = require('./db.js');
var AWSu  = require('./aws_util.js');

var src = path.resolve(__dirname, '../../test/data/orient3.jpg');

describe('db.js', function() {

	it ('#createPhoto', function(done) {
		this.timeout(30 * 1000);
		async.waterfall(
			[
				function readExif(cb) {
					photoUtil.readExifData(src, cb);
				},
				function createPhoto(exif, cb) {
					exif.displayName = "orient3.jpg";
					debug("creating photo");
					db.photo.create(src, exif, 0, function(err, data) {
						if (err && err.name == 'DuplicatePhoto')
							db.photo.delete(err.id, cb);
						else
							cb(err, data);
					});
				},
				function readPhoto(item, cb) {
					debug('reading photo', item.sdbId);
					if (item.s3id == null)
						cb( new Error("Photo was a duplicate " + item.sdbId));
					else
						db.photo.read(item.sdbId, cb);
				},
				function deletePhoto(data, cb) {
					debug('deleting photo', data.itemId);
					db.photo.delete( data.itemId, cb);
				}
			],
			done
		);
	});

});


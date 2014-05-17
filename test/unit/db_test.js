// db_test.js
// util_test.js
var debug = require('debug')('pook:test:db_test');

var assert = require("assert");
var path = require('path');
var promise = require('promised-io/promise');
var fs = require('promised-io/fs');

var photoUtil = require ('../../lib/photo_util.js');
var db = require('../../lib/db.js');
var AWSu  = require('../../lib/aws_util.js');

var src = path.resolve(__dirname, '../data/orient3.jpg');

describe('db.js', function() {

	it ('#createPhoto', function() {
		this.timeout(10 * 1000);
		return promise.seq([
			function() { // read exif
				return photoUtil.readExifData( src ) 
			},
			function(exif) { // create photo
				exif.displayName = "orient3.jpg";
				debug("creating photo");
				p = db.photo.create(src, exif, 0);
				promise.when(p,
					function() {},
					function(err) {
						if (err.name == 'DuplicatePhoto')
							db.photo.delete(err.id);
						debug("Cant create", err.name, err.id);
					});
				return p;
			},
			function(item) { // delete photo
				debug('created', item.sdbId);
				return db.photo.read(item.sdbId);
			},
			function(data) {
				debug('read');
				return db.photo.delete( data.itemId);
			},
			function() {
				debug('deleted');
			}
			]);
	});

});


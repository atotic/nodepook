// db.js
"use strict";
var debug = require('debug')('pook:lib:db');

var async = require('async');
var fs = require('fs');

var AWSu  = require('./aws_util.js');
var utils = require('./util.js');
var photoUtil = require('./photo_util.js');

function DuplicatePhotoError(duplicateItemName) {
    var e = new Error("Duplicate photo");
    e.name = "DuplicatePhoto";
    e.id = duplicateItemName;
    return e;
}

// @callback with DuplicatePhotoError if it finds a duplicate
function rejectDuplicates(md5, ownerId, done) {
	AWSu.sdb.select({
			SelectExpression: "select itemName() from photos where md5='" + md5 + "' and ownerId='" + ownerId + "'",
			ConsistentRead: true
		},
		function(err, data) {
			if (err)
				done(err);
			else if (('Items' in data) && data['Items'].length > 0)
				done(new DuplicatePhotoError(data['Items'][0].Name));
			else
				done();
		}
	);
}

function extensionFromName(name) {
	var ext = '.img';
	if (name) {
		var m = name.match(/.*\.(.*)$/);
		if (m && m.length == 2 && m[1].length > 0 && m[1].length < 5) {
			var e =  ('.' + m[1]).toLowerCase();
			if (['.jpg','.png','.gif'].indexOf(e) != -1)
				ext = ('.' + m[1]).toLowerCase();
		}
	}
	return ext;
}

/**
 * Upload file to s3, create record in SimpleDb
 * If photo already exists, returns existing item id
 * @callback ({ sdbId, s3id}) WARNING: if item is a duplicate, s3id is null, you need to load item to get s3id
 */
function createPhoto(localFile, exif, ownerId, done) {

	var sdbId = AWSu.uniqueId;

	var s3extension = extensionFromName( exif.displayName);

	var attributes = {
		createdAt: (new Date()).toISOString(),
		ownerId: ownerId,
		md5: exif.md5,
		s3id: utils.randomString(6) + "_" + sdbId + s3extension,
		displayName: exif.displayName,
		width: exif.width,
		height: exif.height,
		dateTaken: exif.dateTaken,
		caption: exif.caption,
		latitude: exif.latitude,
		longitude: exif.longitude
	}

	function rollback() {
		debug('rollback');
		async.parallel(
			[
				function deletes3(callback) {
					AWSu.s3.deleteObject( {
							Bucket: AWSu.buckets.photos,
							Key: attributes.s3id
						},
						callback
					);
				},
				function deleteItem(callback) {
					AWSu.sdb.deleteAttributes( {
							DomainName: AWSu.domains.photos,
							ItemName: sdbId
						},
						callback
					);
				}
			]
		)
	};

	function saveToDb() {
		async.waterfall(
			[
				function puts3(callback) {
					AWSu.s3.client.putObject({
					 		Bucket: AWSu.buckets.photos,
							Key: attributes.s3id,
							Body: fs.createReadStream(localFile),
							ContentType: exif.contentType
						},
						callback
					)
				},
				function putSdb(data, callback) {
					AWSu.sdb.putAttributes( {
						DomainName: AWSu.domains.photos,
						ItemName: sdbId,
						Attributes: AWSu.objectToAttributes( attributes )
					},
					callback);
				}
			],
			function(err, data) {
				if (err) {
					rollback(); // save failed, rollback
					done(err,  { sdbId: sdbId, s3id: attributes.s3id });
				}
				else
					done(null, { sdbId: sdbId, s3id: attributes.s3id });
			}
		);
	}

	async.waterfall( [
			function getMd5(cb) {
				if (attributes.md5)
					cb(null, attributes.md5);
				else
					utils.fileMd5(localFile, cb);
			},
			function noDups(md5, cb) {
				attributes.md5 = md5;
				rejectDuplicates(md5, ownerId, cb);
			},
		],
		function(err) {
			if (err) {
				if (err.name == "DuplicatePhoto") {
					debug("got duplicate");
					done(null, { sdbId: err.id, s3id: null });
				}
				else
					done(err);
			}
			else
				saveToDb();
		}
	);
}

function readPhoto(itemId, done) {
	AWSu.sdbReadItem(AWSu.domains.photos, itemId, done);
}

function deletePhoto(sdbId, done) {
	return async.waterfall([
		function(callback) {
			readPhoto(sdbId, callback);
		},
		function deleteS3(photo, callback) {
			async.parallel( [
					function(callback) {
						AWSu.s3.client.deleteObject({
							Bucket: AWSu.buckets.photos,
							Key: photo.s3id
						}, callback);
					},
					function(callback) {
						AWSu.s3.client.deleteObject({
							Bucket: AWSu.buckets.photos,
							Key: photo.s3id + photoUtil.separator + "256"
						}, callback);
					},
					function(callback) {
						AWSu.s3.client.deleteObject({
							Bucket: AWSu.buckets.photos,
							Key: photo.s3id + photoUtil.separator + "1024"
						}, callback);
					},
				],
				callback
				);
		},
		function deleteSdb(data, callback) {
			debug('deleteSdb');
			AWSu.sdb.deleteAttributes({
				DomainName: AWSu.domains.photos,
				ItemName: sdbId
			}, callback);
		},
		function finalize(ignore, callback) {
			debug('photo deleted', sdbId);
			callback();
		}
	],
	done
	);
}

module.exports = {
	photo: {
		create: createPhoto,
		read: readPhoto,
		delete: deletePhoto
		// update: updatePhoto
	}
}

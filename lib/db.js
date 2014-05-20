// db.js
"use strict";
var debug = require('debug')('pook:lib:db');

var promise = require('promised-io/promise');
var AWSu  = require('./aws_util.js');
var utils = require('./util.js');

function DuplicatePhotoError(duplicateItemName) {
    var e = new Error("Duplicate photo");
    e.name = "DuplicatePhoto";
    e.id = duplicateItemName;
    return e;
}

function ItemNotFound(itemName) {
	var e = new Error("Photo not found");
	e.name = "PhotoNotFound";
	e.id = itemName;
	return e;
}

// Throws DuplicatePhotoError if it finds a duplicate
function rejectDuplicates(md5) {
	var deferred = new promise.Deferred();
	var p = AWSu.sdb.select("select itemName() from photos where md5='" + md5 + "'");
	promise.when(p, 
		function success(data) {
			if (('Items' in data) && data['Items'].length > 0) 
				deferred.reject(new DuplicatePhotoError(data['Items'][0].Name));
			else
				deferred.resolve();
		},
		function error(err) {
			deferred.reject(err);
		}
	);
	return deferred.promise;
}

/**
 * Upload file to s3, create record in SimpleDb
 * @throws DuplicatePhotoError
 * @returns promise({ sdbId, s3id})
 */
function createPhoto(localFile, exif, ownerId) {

	var sdbId = AWSu.uniqueId();

	var s3extension = '.img';
	if (exif.displayName) {
		var m = exif.displayName.match(/.*\.(.*)$/);
		if (m && m.length == 2 && m[1].length > 0 && m[1].length < 5)
			s3extension = '.' + m[1];
	}
	
	var attributes = {
		createdAt: (new Date()).toISOString(), 
		ownerId: ownerId,
		md5: 0,
		s3id: sdbId + utils.randomString(6) + s3extension,
		displayName: exif.displayName,
		width: exif.width,
		height: exif.height,
		dateTaken: exif.dateTaken,
		caption: exif.caption,
		latitude: exif.latitude,
		longitude: exif.longitude
	}

	// added random string to uniqueId to prevent private photo discovery
	var seq = promise.seq([
		function() { return utils.fileMd5(localFile) },
		function(md5) { // check for md5 duplicates
			// debug('createPhoto rejectDuplicates');
			attributes.md5 = md5;
			return rejectDuplicates(md5);
		},
		function() {
			// debug('createPhoto uploadFile');
			return AWSu.s3.uploadFile('photos', localFile, attributes.s3id);
		},
		function() {
			// debug('createPhoto createItem');
			return AWSu.sdb.createItem('photos', sdbId, attributes);
		},
		function() {
			// debug('createPhoto returnItem');
			return { sdbId: sdbId, s3id: attributes.s3id };
		}
	]);

	// clean up on error
	promise.when(seq, 
		function success() {
			// debug('createPhoto success')
		},
		function(err) {
			debug("Error recovery", err.name, err.id);
			AWSu.s3.deleteKey('photos', attributes.s3id);
			AWSu.sdb.deleteItem('photos', sdbId);
		});
	return seq;
}

function readPhoto(itemId) {
	return AWSu.sdb.readItem('photos', itemId);
}

function deletePhoto(sdbId) {
	return promise.seq([
		function() {
			return readPhoto(sdbId);
		},
		function(data) {
			return AWSu.s3.deleteKey( 'photos', data.s3id);
		},
		function() {
			return AWSu.sdb.deleteItem('photos', sdbId);
		},
		function() {
			// debug('photo deleted', sdbId);
		}
	]);
}

module.exports = {
	photo: {
		create: createPhoto,
		read: readPhoto,
		delete: deletePhoto
		// update: updatePhoto
	}
}

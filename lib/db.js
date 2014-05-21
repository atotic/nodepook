// db.js
"use strict";
var debug = require('debug')('pook:lib:db');

var promise = require('promised-io/promise');
var fs = require('fs');

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
function rejectDuplicates(md5, ownerId) {
	var deferred = new promise.Deferred();
	var p = AWSu.sdb.select("select itemName() from photos where md5='" + md5 + "' and ownerId='" + ownerId + "'");
	// var p = AWSu.sdb.select("select itemName() from photos where md5='" + md5 + "'");
	// debug('rejectDuplicates');
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
 * If photo already exists, returns existing item
 * @returns promise({ sdbId, s3id}) WARNING: if item is a duplicate, s3id is null, you need to load item to get s3id
 */
function createPhoto(localFile, exif, ownerId) {

	var sdbId = AWSu.uniqueId();

	var s3extension = '.img';
	if (exif.displayName) {
		var m = exif.displayName.match(/.*\.(.*)$/);
		if (m && m.length == 2 && m[1].length > 0 && m[1].length < 5) {
			var e =  ('.' + m[1]).toLowerCase();
			if (['.jpg','.png','.gif'].indexOf(e) != -1)
				s3extension = ('.' + m[1]).toLowerCase();
		}
	}
	
	var attributes = {
		createdAt: (new Date()).toISOString(), 
		ownerId: ownerId,
		md5: 0,
		s3id: utils.randomString(6) + "_" + sdbId + s3extension,
		displayName: exif.displayName,
		width: exif.width,
		height: exif.height,
		dateTaken: exif.dateTaken,
		caption: exif.caption,
		latitude: exif.latitude,
		longitude: exif.longitude
	}

	var deferred = promise.Deferred();

	function saveToDb() {
		promise.when( 
			promise.seq([
				function() {
					// debug('createPhoto uploadStream');
					return AWSu.s3.putObject('photos', 
						attributes.s3id,
						fs.createReadStream(localFile));
				},
				function() {
					// debug('createPhoto createItem');
					return AWSu.sdb.createItem('photos', sdbId, attributes);
				}
			]),
		 	function success() {
		 		deferred.resolve( { sdbId: sdbId, s3id: attributes.s3id });
		 	},
		 	function error(err) {
		 		AWSu.s3.deleteKey( 'photos', attributes.s3id);
		 		AWSu.sdb.deleteItem('photos', sdbId);
		 		deferred.reject(err);
		 	}
		)
	}

	promise.when( 
		utils.fileMd5(localFile), // read md5
		function success(md5) {
			attributes.md5 = md5;
			promise.when( 
				rejectDuplicates(md5, ownerId), // find duplicates
				saveToDb,
				function haveDuplicate(err) { // have duplicate, resolve right away
					if (err.name == "DuplicatePhoto")
						deferred.resolve( { sdbId: err.id, s3id: null });
					else
						deferred.reject(err);
				}
			)
		},
		function error(err) {
			deferred.reject(err);
		}
	);
	return deferred.promise;
}

function readPhoto(itemId) {
	return AWSu.sdb.readItem('photos', itemId);
}

function deletePhoto(sdbId) {
	return promise.seq([
		function() {
			return readPhoto(sdbId);
		},
		function deleteS3(data) {
			return promise.all([
				AWSu.s3.deleteKey( 'photos', data.s3id),
				AWSu.s3.deleteKey( 'photos', data.s3id +  "?size=256"),
				AWSu.s3.deleteKey( 'photos', data.s3id +  "?size=1024")
				]);
		},
		function deleteSdb() {
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

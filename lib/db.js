// db.js
var promise = require('promised-io/promise');
var AWSu  = require('./aws_util.js');
var utils = require('./util.js');

function DuplicatePhotoError(duplicateItemName) {
    var e = new Error("Duplicate photo");
    e.name = "DuplicatePhoto";
    e.itemName = duplicateItemName;
    return e;
}

// Throws DuplicatePhotoError if it finds a duplicate
function rejectDuplicates(sdb, md5) {
	var deferred = new promise.Deferred();
	var p = sdb.select('select ItemName() from photos where md5=' + md5);
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

// uploads file to s3, create record in simpleDb
// Caller should handle DuplicatePhotoError
function createPhoto(localFile, exif, owner) {

	var sdb = AWSu.sdb.connect();

	var attributes = {
		createdAt: (new Date()).toISOString(), 
		ownerId: 0,
		md5: 0,
		displayName: exif.displayName,
		width: exif.width,
		height: exif.height,
		dateTaken: exif.dateTaken,
		caption: exif.caption,
		latitude: exif.latitude,
		longitude: exif.longitude
	}

	var sdbItemName = AWSu.uniqueId();
	// added random string to uniqueId to prevent private photo discovery
	var s3key = sdbItemName + utils.randomString(6);

	var seq = promise.seq([
		function() { return utils.fileMd5(localFile) },
		function(md5) { // check for md5 duplicates
			attributes.md5 = md5;
			return rejectDuplicates(sdb, md5);
		},
		function() {
			return AWSu.s3.uploadFile('photos', localFile, s3key);
		},
		function() {
			return AWSu.sdb.createItem(sdb, 'photos', sdbItemName, attributes);
		}
	]);

	// clean up on error
	promise.when(seq, 
		function success() {
			console.log('createPhoto success')
		},
		function(err) {
			AWSu.s3.deleteKey('photos', s3key);
			AWSu.sdb.deleteItem(sdb, 'photos', sdbItemName);
		});
	return seq;
}

function readPhoto(itemId) {
	var sdb = AWSu.sdb.connect();
}

module.exports = {
	photo: {
		create: createPhoto,
		read: readPhoto
		// update: updatePhoto
	}
}

// Photo.js
"use strict"
var debug = require('debug')('pook:lib:Photo');

var async = require('async');
var fs = require('fs');
var gm = require('gm');
var moment = require('moment');
var path = require('path');
var spawn = require('child_process').spawn;

var separator = '~';

var AWSu  = require('./aws_util.js');
var utils = require('./util.js');

/** @returns photoPath */
function autoRotate(photoPath, done) {
  var args = ['convert', photoPath, '-auto-orient', photoPath ];
  spawn('gm', args) 
    .on('error', function(err) {
      done(err);
    })
    .on('exit', function(code, signal) {
      if (code != 0)
        done(new Error("autoRotate error exit. code:" + code + " signal: " + signal), context);
      else
        done(null, photoPath);
    });
};

/**
 * @param image {buffer|filePath}
 * @returns gm 
 */
function resize(image, maxHeight) {
  return gm(image).resize(maxHeight * 1.34, maxHeight, '>');
}

/**
 * @params gps: 37/1 2574/100 0/1
 * @params ref: N|W
 * @returns lattitude in degrees.
 */
function exifLatLongToDecimal(gps, ref) {
  var coords = gps.split(' ');
  if (coords.length != 3) return null;
  var degrees = 0;
  for (var i=0; i<3; i++) {
    var nomDenom = coords[i].split('/');
    degrees += ( parseInt(nomDenom[0]) / parseInt(nomDenom[1]) ) / ([1,60,3600][i]);
  }
  if (ref == 'N' || ref == 'W')
    degrees *= -1;
  return degrees;
}

// resolve(exifData)
function readExifData(photoPath, done) {

  var exifData = {};

  var exifTags = {
    width: 'Exif.Photo.PixelXDimension',
    height: 'Exif.Photo.PixelYDimension',
    dateTimeOriginal: 'Exif.Photo.DateTimeOriginal', 
    dateTime: 'Exif.Image.DateTime', 
    description: 'Xmp.dc.description',
    title: 'Xmp.dc.title',
    latitude: 'Exif.GPSInfo.GPSLatitude',
    latitudeRef: 'Exif.GPSInfo.GPSLatitudeRef',
    longitude: 'Exif.GPSInfo.GPSLongitude',
    longitudeRef: 'Exif.GPSInfo.GPSLongitudeRef'
    // mimeType: computed by gm
  }

  // build command line
  var args = ['-Pkv']
  for (var p in exifTags) {
    args.push('-g');
    args.push( exifTags[p] );
  }
  args.push(photoPath);

  // exiv2 data query
  var process = spawn('exiv2', args);

  process.on('error', done);

  // parse the output
  process.stdout.on('data', function(data) {
    data.toString().split('\n').forEach( function(line) {
      var match = line.match(/(\S+)(\s+)(.*)/);
      if (match && match.length == 4) {
        for (p in exifTags) {
          if ( exifTags[p] == match[1] ) {
            // console.log("read exif", match[3]);
            exifData[p] = match[3];
          }
        }
      }
      else 
        if (line != '')
          console.log('could not parse exif line', line);
    });
  });

  process.on('exit', function(code, signal) {
    if (code != 0 && code != 253) // 253 is ok for exiv2, see http://dev.exiv2.org/boards/3/topics/1582
      done(new Error("readExifData error exit. code:" + code + " signal: " + signal));
    else {
      // post process the exif data
      var gmPhoto = gm(photoPath);
      async.series([
          function widthHeight(fn) { 
          // get size if needed
            if ( 'width' in exifData && 'height' in exifData)
              fn();
            else {
              gmPhoto.size( function(err, size) {
                  if (err)
                    fn(err);
                  else {
                    exifData.width = size.width;
                    exifData.height = size.height;
                    fn();
                  };
              });
            }
          },
          function mimeType(fn) { 
          // get mime type
            gmPhoto.format( function(err, data) {
              if (err)
                fn(err);
              else {
                var MIME_FORMATS = {
                  'JPEG' : 'image/jpeg',
                  'PNG' : 'image/png',
                  'GIF' : 'image/gif'
                };
                exifData.contentType = data in MIME_FORMATS ?  
                  MIME_FORMATS[data] : 'application/octet-stream';
                fn();
              }
            });
          },
          function normalizeExif(fn) {
          // normalize latitude/longitude
            if ('latitude' in exifData) {
              exifData.latitude = exifLatLongToDecimal( exifData.latitude, exifData.latitudeRef);
              exifData.longitude = exifLatLongToDecimal( exifData.longitude, exifData.longitudeRef);
            }
            exifData.caption = exifData.description || exifData.title;
            exifData.dateTaken = exifData.dateTimeOriginal || exifData.dateTime;
            if (exifData.dateTaken) {
              exifData.dateTaken = moment(exifData.dateTaken, "YYYY:MM:DD HH:mm:s")
                .toISOString();
            }
            fn();
          }
        ],
        function(err, result) {
          done(err, exifData);
        });
      } 
    });
}


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
 *
 * @callback (err, [photo*])
 */
function photosByUserId(userId, done) {
  var photos = [];
  done(null, photos);
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
              Key: photo.s3id + separator + "256"
            }, callback);
          },
          function(callback) {
            AWSu.s3.client.deleteObject({
              Bucket: AWSu.buckets.photos,
              Key: photo.s3id + separator + "1024"
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

  // constants
  hostUrl: "http://pookio-test.s3-website-us-west-2.amazonaws.com/",
  separator: separator, // url separator

  // image manipulation
  autoRotate: autoRotate,
  readExifData: readExifData,
  resize: resize,

  // database queries
  photosByUserId: photosByUserId,
  // CRUD
  create: createPhoto,
  read: readPhoto,
  delete: deletePhoto
}


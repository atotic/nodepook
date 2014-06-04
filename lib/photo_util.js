// photo_util.js
"use strict"
var debug = require('debug')('pook:lib:photoutil');

var async = require('async');
var fs = require('fs');
var gm = require('gm');
var moment = require('moment');
var path = require('path');
var spawn = require('child_process').spawn;

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


module.exports = {
  hostUrl: "http://pookio-test.s3-website-us-west-2.amazonaws.com/",
  separator: '~', // url separator
  autoRotate: autoRotate,
  readExifData: readExifData,
  resize: resize
}


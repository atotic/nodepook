// photo_util.js
"use strict"
var debug = require('debug')('pook:lib:photoutil');

var fs = require('promised-io/fs');
var spawn = require('child_process').spawn;
var promise = require('promised-io/promise');
var path = require('path');
var moment = require('moment');
var gm = require('gm');

// resolve(rotatedPath)
function autoRotate(photoPath) {
  var deferred = new promise.Deferred();
  var args = ['convert', photoPath, '-auto-orient', photoPath ];
  spawn('gm', args) 
    .on('error', function(err) {
      deferred.reject(err);
    })
    .on('exit', function(code, signal) {
      if (code != 0)
        deferred.reject(new Error("autoRotate error exit. code:" + code + " signal: " + signal), context);
      else
        deferred.resolve(photoPath);
    });
  return deferred.promise;
};

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
function readExifData(photoPath) {
  var deferred = new promise.Deferred();
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
  }
  var args = ['-Pkv']
  for (var p in exifTags) {
    args.push('-g');
    args.push(exifTags[p]);
  }
  args.push(photoPath);
  var exifData = {};
  // exiv2 data query
  var process = spawn('exiv2', args);
  process
    .on('error', function(err) {
      deferred.reject(err);
    })
    .on('exit', function(code, signal) {
      if (code != 0 && code != 253) // 253 is ok for exiv2, see http://dev.exiv2.org/boards/3/topics/1582
        deferred.reject(new Error("readExifData error exit. code:" + code + " signal: " + signal));
      else {
        // post process
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
        if ( 'width' in exifData && 'height' in exifData)
          deferred.resolve(exifData);
        else // no size in exif data, must read manually
          gm(photoPath).size( function(err, value) {
            if (err)
              deferred.reject(err);
            else
              deferred.resolve(exifData);
          });
      } 
    });
  // process exiv2 output
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
  return deferred.promise;
}


module.exports = {
  autoRotate: autoRotate,
  readExifData: readExifData
}


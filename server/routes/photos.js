var debug = require('debug')('pook:routes:photos');

"use strict";

var async = require('async');
var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var gm = require('gm');
var path = require('path');

var AWSu = require ('../common/aws_util.js');
var Photo = require('../common/Photo.js');

var router = express.Router();

var uploadDir = path.resolve(__dirname, '../../uploads');


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

router.route('/')
  .post( function uploadPhoto(req, res, next) {

    debug("got a file");
    var form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.type = 'multipart';
    form.hash = 'md5';

    var exifData;
    var file;

    async.waterfall(
      [
        function parseForm(cb) {
          form.parse(req, cb);
        },
        function autoRotate(fields, files, cb) {
          file = files.myPhoto;
          Photo.autoRotate(file.path, cb);
        },
        function readExifData(ignore, cb) {
          Photo.readExifData(file.path, cb);
        },
        function uploadPhoto(inExifData, cb) {
          exifData = inExifData;
          exifData.md5 = file.hash;
          Photo.uploadToS3(file.path, exifData.contentType, cb);
        },
        function resizeTo1024(s3id, cb) {
          exifData.s3id = s3id;
          gm(file.path).resize(1024 * 1.33, 1024, '>').toBuffer(cb);
        },
        function upload1024(buffer, cb) {
          AWSu.s3.putObject({
            Bucket: AWSu.buckets.photos,
            Key: exifData.s3id + Photo.separator + '1024',
            Body: buffer,
            ContentType: exifData.contentType,
            StorageClass: 'REDUCED_REDUNDANCY'
            },
            cb);
        },
        function resizeTo256(ignore, cb) {
          gm(file.path).resize(256 * 1.33, 256, '>').toBuffer(cb);
        },
        function upload256(buffer, cb) {
          AWSu.s3.putObject({
            Bucket: AWSu.buckets.photos,
            Key: exifData.s3id + Photo.separator + '256',
            Body: buffer,
            ContentType: exifData.contentType,
            StorageClass: 'REDUCED_REDUNDANCY'
            },
            cb);         
        },
        function deleteFile(ingore, cb) {
          fs.unlink(file.path, cb);
        },
      ],
      function final(err, result) {
        if (err)
          next(err);
        else {
          res.format(
            {
              'application/json': function() {
                res.send( { msg: "Photo created", item: exifData } );
              },
              default: function() {
                res.render('photo', { photoSrc: photoData.s3id + "~1024"});
              }
            }
          );
        }
      }
      );
  });

router.get('/test', function testS3(req, res, next) {
  AWSu.s3.listBuckets(function(err, data) {
    if (err)
      next(err);
    else {
      res.render('dev', {message: 'listBuckets', payload: data})
    }
  });
});

module.exports = router;


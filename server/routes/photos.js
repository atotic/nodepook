var debug = require('debug')('pook:routes:photos');
"use strict";

var async = require('async');
var express = require('express');
var fs = require('fs');
var path = require('path');

var AWSu = require ('../common/aws_util.js');
var db = require('../common/db.js');
var photoUtil = require('../common/photo_util.js');

var router = express.Router();

var uploadDir = path.resolve(__dirname, '../../uploads');

router.use('/', express.static( uploadDir ));

router.route('/')
  .post( function uploadPhoto(req, res, next) {

    debug("got a file", req.files.myPhoto.originalname);

    var photoPath = path.join(uploadDir, req.files.myPhoto.name);

    var exifData;
    var bucketName = req.files.myPhoto.name;
    var itemIds;

    async.waterfall(
      [
        function autoRotate(cb) {
          photoUtil.autoRotate(photoPath, cb);
        },
        function readExifData(ignore, cb) {
          photoUtil.readExifData(photoPath, cb);
        },
        function createPhoto(inExifData, cb) {
          exifData = inExifData;
          exifData.displayName = req.files.myPhoto.originalname;
          db.photo.create(photoPath, exifData, 0, cb);
        },
        function deleteFile(inItemIds, cb) {
          itemIds = inItemIds;
          fs.unlink(photoPath, cb);
        }
      ],
      function final(err, result) {
        if (err)
          next(err);
        else {
          res.format(
            {
              'application/json': function() {
                res.send( { photoId: itemIds.sdbId } );
              },
              default: function() {
                if (itemIds.s3id)
                  res.render('photo', { photoSrc: itemIds.s3id + "~1024"});
                else
                  res.send('Not rendering duplicate items yet'); // TODO
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


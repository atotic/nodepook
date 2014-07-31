var debug = require('debug')('pook:routes:photos');
"use strict";

var async = require('async');
var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');

var auth = require('./auth');
var AWSu = require ('../common/aws_util.js');
var Photo = require('../common/Photo.js');

var router = express.Router();

var uploadDir = path.resolve(__dirname, '../../uploads');

router.use('/', express.static( uploadDir ));
router.use(auth.loadUserFromCookie);

router.route('/')
  .post( function uploadPhoto(req, res, next) {

    debug("got a file");
    var form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.type = 'multipart';
    form.hash = 'md5';

    var exifData;
    var itemIds;
    var file;
    async.waterfall(
      [
        function validateUser(cb) {
          if (!req.user)
            cb(new Error("user must be logged in"));
          else
            cb();
        },
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
        function createPhoto(inExifData, cb) {
          exifData = inExifData;
          exifData.displayName = file.name;
          exifData.md5 = file.hash;
          Photo.create(file.path, exifData, req.user.itemId, cb);
        },
        function deleteFile(inItemIds, cb) {
          itemIds = inItemIds;
          fs.unlink(file.path, cb);
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


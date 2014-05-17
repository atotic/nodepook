var debug = require('debug')('pook:routes:photos');

var express = require('express');
var path = require('path');
var promise = require('promised-io/promise');
var fs = require("promised-io/fs").fs;

var AWSu = require ('../lib/aws_util.js');
var photoUtil = require('../lib/photo_util.js');
var db = require('../lib/db.js');

var router = express.Router();

router.use('/', express.static( path.resolve(__dirname, '../uploads') ));

router.route('/')
  .post( function uploadPhoto(req, res, next) {

    debug("got a file", req.files.myPhoto.originalname);

    var photoPath = path.resolve(__dirname,'../uploads/' + req.files.myPhoto.name);

    var exifData;
    var bucketName = req.files.myPhoto.name;
    var itemIds;

    var seq = promise.seq([
      function autoRotate() { return photoUtil.autoRotate(photoPath) },
      function readExifData() { return photoUtil.readExifData(photoPath) },
      function createPhoto(inExifData) { 
        exifData = inExifData;
        exifData.displayName = req.files.myPhoto.originalname;
        return db.createPhoto(photoPath, exifData, 0);
      },
      function deleteFile(inItemIds) {
        itemIds = inItemIds;
        return fs.unlink(photoPath);
      }
      function render() {
        res.render('photo', { photoSrc: itemIds.s3id })
      }
    ]);
    return seq;
  });

  router.get('/test', function testS3(req, res, next) {
    var s3 = AWSu.s3.connect('photos');
    s3.listBuckets(function(err, data) {
      if (err) {
        debugger;
        throw new Error("S3 error",  err.message);
      } else {
        res.render('dev', {message: 'listBuckets', payload: data})
      }
    });
  });

module.exports = router;


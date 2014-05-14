var debug = require('debug')('pook:routes:photos');

var express = require('express');
var path = require('path');
var fs = require('fs');
var promise = require('promised-io/promise');

var AWSu = require ('../lib/aws_util.js');
var photoUtil = require('../lib/photo_util.js');

var router = express.Router();

router.use('/', express.static( path.resolve(__dirname, '../uploads') ));

router.route('/')
  .post( function uploadPhoto(req, res, next) {

    debug("got a file", req.files.myPhoto.originalname);

    var photoPath = path.resolve(__dirname,'../uploads/' + req.files.myPhoto.name);

    var exifData;
    var bucketName = req.files.myPhoto.name;

    var sequence = promise.seq([
      function() { return photoUtil.autoRotate(photoPath) },
      function() { return photoUtil.readExifData(photoPath) },
      function(inExifData) { exifData = inExifData; return null;},
      function() { return AWSu.s3.uploadFile('photos', photoPath, bucketName) }
      // store in db
      // delete file
    ], photoPath);

    promise.when(sequence, 
      function success() {
        res.render('photo', { photoSrc: bucketName });        
      },
      function error(err) {
        throw err;
      }
    );
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


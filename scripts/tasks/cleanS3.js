#! /usr/bin/env node

var debug = require('debug')('pook:tasks');

var async = require('async');
var AWS = require('aws-sdk');
var path = require('path');

var AWSu = require('../../server/common/aws_util.js');
var util = require('../../server/common/util.js');

"use strict";

var async = require('async');
var AWS = require('aws-sdk');
var path = require('path');
var Route53 = require('nice-route53');

var bucket = 'pookio-test';

async.waterfall([
    function listBucket(cb) {
      AWSu.s3.listObjects({
        Bucket: bucket,
        Delimiter: '/'
      },
      cb);
    },
    function deleteKeys(data, cb) {
      async.map(data.Contents, function(item, callback) {
          if ( ['404.jpg', 'index.jpg', 'loading.jpg'].indexOf(item.Key) == -1) {
            console.log('deleting key ', item.Key);
            AWSu.s3.deleteObject(
              {
                Bucket: bucket,
                Key: item.Key
              },
              callback);
          }
          else
            callback();
        },
        cb
      );
    }     
  ],
  function complete(err) {
    if (err) {
      console.log("Have error", err);
      process.exit(1);
    }
    process.exit(0);
  }
);

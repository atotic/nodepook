#! /usr/bin/env node

var debug = require('debug')('pook:tasks');

var async = require('async');
var AWS = require('aws-sdk');
var path = require('path');
var Route53 = require('nice-route53');

var util = require('../../server/common/util.js');

"use strict";

var bucket = 'pookio-test';

var hostname = hostname || 'resize';

var r53 = new Route53(AWS.config.credentials);

var hostAddress;

async.waterfall([
  function getIp(cb) {
    util.hostIp(cb);
  },
  function getZones(ip, cb) {
    hostAddress = ip;
    r53.zones(cb);
  },
  function setRecord(domains, cb) {
    r53.setRecord( {
        zoneId: domains[0].zoneId,
        name: hostname + ".pook.io",
        type: 'A',
        ttl: 300,
        values: [ hostAddress ]
      });
  },
  function showMessage(cb) {
    console.log('registered ' + hostname + ' as ' + ip);
    cb();
  }
  ],
  function complete(err) {
    if (err) {
      console.log("Error", err);
      process.exit(1);
    }
    else
      process.exit(0);
  }
);

// angular.js
var debug = require('debug')('pook:routes:angular');
"use strict";

var async = require('async');
var express = require('express');
var fs = require("fs");
var gm = require('gm');
var path = require('path');

var AWSu = require ('../lib/aws_util.js');
var photoUtil = require('../lib/photo_util.js');
var util = require('../lib/util.js')

var router = express.Router();

router.get('/', function stats(req, res, next) {
   res.render('angular');
 });

module.exports = router;

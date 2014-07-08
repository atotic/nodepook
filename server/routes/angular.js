// angular.js
var debug = require('debug')('pook:routes:angular');
"use strict";

var async = require('async');
var express = require('express');
var fs = require("fs");
var gm = require('gm');
var path = require('path');

var AWSu = require ('../common/aws_util.js');
var Photo = require('../common/Photo.js');
var util = require('../common/util.js')

var router = express.Router();

router.get('/', function stats(req, res, next) {
   res.render('angular');
 });

module.exports = router;

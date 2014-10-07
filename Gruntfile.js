// This gruntfile is ugly. I have not idea how to make pretty grunt
// https://github.com/angular/angular.js/blob/master/Gruntfile.js should inspire me to do better

var debug = require('debug')('pook:grunt');

"use strict";

var async = require('async');
var AWS = require('aws-sdk');
var path = require('path');
var Route53 = require('nice-route53');

var AWSu = require('./server/common/aws_util.js');
var util = require('./server/common/util.js');

module.exports = function(grunt) {
"use strict";

	grunt.loadNpmTasks('grunt-debug');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
	});

	grunt.registerTask('cleanBucket', function(bucket) {
		console.log('S3 clean bucket: ', bucket);

		var done = this.async();
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
				if (err)
					console.log("Have error", err);
				done(err);
			}
		);
	});

	grunt.registerTask('eraseEverything', ['cleanBucket:pookio-test']);

	grunt.registerTask('netRegisterHostAs', function(hostname) {

		var done = this.async();
		hostname = hostname || 'resize';

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
			],done);
	});

//	grunt.registerTask('default', );
};

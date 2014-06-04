var debug = require('debug')('pook:test:routes');
var request = require('supertest');

var async = require('async');
var path = require('path');

var app = require('../../app.js');
var db = require('../../lib/db.js');
var AWSu = require('../../lib/aws_util.js');
var util = require('../../lib/util.js');
var photoUtil = require('../../lib/photo_util.js');

var src = path.resolve(__dirname, '../data/tiny.jpg');

describe('/resize', function() {

	it ('/s3key$size', function(done) {
		// http://localhost:3000/resize/fggYxMFaaaaxB7eXi.jpg
		this.timeout(1990*1000);
		var s3id;
		var sdbId;

		async.waterfall(
			[
				function createPhoto(cb) {
						return db.photo.create(src, {
							displayName: "yellow.jpg",
							contentType: 'image/jpg',
							width: 100,
							height: 100
						},0, cb);
					},
					function test256(item, cb) {
						if (item.s3id == null)
							return cb(new Error("duplicate photo, can't upload " + item.sdbId));
						s3id = item.s3id;
						sdbId = item.sdbId;
						request(app)
							.get("/resize/" + item.s3id + photoUtil.separator + "256")
							.expect(200)
							.end( cb );
					},
					function test1024(ignore, cb) {
						request(app)
							.get('/resize/' + s3id + photoUtil.separator + "1024")
							.expect(200)
							.end( cb );
					},
					function deletePhoto(ignore, cb) {
						db.photo.delete(sdbId, cb);
					}
			],
			function complete(err, result) {
				done(err);
			}
		);
	});

});

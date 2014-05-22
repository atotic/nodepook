var debug = require('debug')('pook:test:routes');
var request = require('supertest');

var path = require('path');
var promise = require('promised-io/promise');

var app = require('../../app.js');
var db = require('../../lib/db.js');
var AWSu = require('../../lib/aws_util.js');
var util = require('../../lib/util.js');
var photoUtil = require('../../lib/photo_util.js');

var src = path.resolve(__dirname, '../data/tiny.jpg');

describe('/resize', function() {

	it.only ('/s3key$size', function(done) {
		// http://localhost:3000/resize/fggYxMFaaaaxB7eXi.jpg
		this.timeout(1990*1000);
		var s3id;
		var sdbId;
		var seq = promise.seq([
			function createPhoto() {
				return db.photo.create(src, {
					displayName: "yellow.jpg",
					contentType: 'image/jpg',
					width: 100,
					height: 100
				},0);
			},
			function test256(item) {
				var deferred = new promise.Deferred();
				if (item.s3id == null)
					throw new Error("duplicate photo, can't upload " + item.sdbId);
				s3id = item.s3id;
				sdbId = item.sdbId;
				request(app)
					.get("/resize/" + item.s3id + photoUtil.separator + "256")
					.expect(200)
					.end( util.callbackFromPromise(deferred));
				return deferred.promise;
			},
			function test1024() {
				var deferred = new promise.Deferred();
				request(app)
					.get('/resize/' + s3id + photoUtil.separator + "1024")
					.expect(200)
					.end( util.callbackFromPromise(deferred));
				return deferred.promise;
			},
			function deletePhoto() {
				return db.photo.delete(sdbId);
			}
		]);
		promise.when(
			seq,
			function() { done() },
			function error(err) { done(err)}
		);
	});
});

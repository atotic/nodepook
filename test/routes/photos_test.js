// photos_test.js
var debug = require('debug')('pook:test:routes');
var request = require('supertest');
var path = require('path');
var app = require('../../app.js');
var db = require('../../lib/db.js');
var promise = require('promised-io/promise');

var testPath = path.resolve(__dirname,'../data/tiny.jpg');

describe('/photos', function() {

	it('/test', function(done) {
		request(app)
			.get('/photos/test')
			.expect(200, done);
	});

	it('/ POST', function(done) {
		this.timeout(10 * 1000);
		request(app)
			.post('/photos')
			.attach('myPhoto', testPath)
			.accept('application/json')
			.expect(200)
			.end( function(err, res) { // delete new photo
				if (err)
					done(err);
				else {
					promise.when(db.photo.delete( res.body.photoId),
						function success() { done() },
						function error(err) { done(err) }
					)
				}
			});
	});
});

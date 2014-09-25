// photos.spec.js

var debug = require('debug')('pook:test:routes');
var path = require('path');
var request = require('supertest');

var app = require('../instances/app.js');
var Photo = require('../common/Photo.js');

var datadir = path.resolve(__dirname, '../../test/data');
var testPath = path.join(datadir,'orient1.jpg');

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
          Photo.deleteFromS3( res.body.item.s3id, done);
        }
      });
  });
});


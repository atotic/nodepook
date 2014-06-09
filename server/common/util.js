// util.js - miscelaneous utilities
var debug = require('debug')('pook:lib:util');

var fs = require('fs');
var os = require('os');

var crypto = require('crypto');

var AWSu = require ('./aws_util.js');

function invertCallback(cb) {
  return function(err, data) {
    if (err)
      cb(null, data);
    else
      cb(new Error('inverted'), data);
  }
}

function fileCopy(src, dest, done) {

  var reader = fs.createReadStream(src);
  reader.on("error", function(err) { done(err) });

  var writer = fs.createWriteStream(dest);
  writer.on("error", function(err) { done(err) });
  writer.on("close", function(ex) { done(null, dest) });

  reader.pipe(writer);
}

function randomString(len, charSet) {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz,randomPoz+1);
  }
  return randomString;
}

function fileMd5(filename, done) {
  var md5 = crypto.createHash('md5');

  var s = fs.ReadStream(filename)
    .on('data', function(d) { md5.update(d); })
    .on('end', function() {
      done(null,  md5.digest('hex'));
    })
    .on('error', function(err) {
      done(err);
    });
}

/**
 * @returns ip: "111.1.11.1" If multiple, returns 1st one found
 * On AWS, returns public ip
 */
function hostIp(done) {
  // debug('hostIp');
  function ipFromNetworkInterface() {
    // read host from network interface, when not on EC2
    // debug('ipFromNetworkInterface');
    var ifaces=os.networkInterfaces();
    for (var netCode in ifaces) { 
      // for each network interface, get 
      var good = ifaces[netCode].filter( function( details ) { 
          return details.family == 'IPv4' && !details.internal 
        });
      if (good.length > 0) {
        done(null, good[0].address);
        return;
      }
    }
    done(new Error("No local ip available"));
  }
  // EC2, get public ip from metadata
  AWSu.metadata.request('/latest/meta-data/public-ipv4', function(err, data) {
    if (err)
      ipFromNetworkInterface();
    else
      done(null, data);
  });
}

module.exports = {
  fileCopy: fileCopy,
  randomString: randomString,
  fileMd5: fileMd5,
  hostIp: hostIp,
  invertCallback: invertCallback
}

// util.js - miscelaneous utilities
var debug = require('debug')('pook:lib:util');

var fs = require('fs');
var os = require('os');

var promise = require('promised-io/promise');
var crypto = require('crypto');

function fileCopy(src, dest) {
  var deferred = new promise.Deferred();

  var reader = fs.createReadStream(src);
  reader.on("error", function(err) { deferred.reject(err) });

  var writer = fs.createWriteStream(dest);
  writer.on("error", function(err) { deferred.reject(err) });
  writer.on("close", function(ex) { deferred.resolve(dest) });

  reader.pipe(writer);
  return deferred.promise;
}

// swap reject/resolve logic, useful in testing
function invertPromise(p) {
  var deferred = new promise.Deferred();
  promise.when(p, 
    function(data) { deferred.reject(data) }, 
    function(err) { deferred.resolve(err) }
    // function(data) { console.log("invert resolve"); deferred.reject(data) }, 
    // function(err) { console.log("invert reject");deferred.resolve(err) }
  )
  return deferred.promise;
}

function printPromise(p) {
  promise.when(p,
    function(data) { console.log("Promise:", data); }, 
    function(err) { console.log("Failpromise:", err); }
  )
}

function createRejectedPromise(msg) {
  var deferred = new promise.Deferred();
  deferred.reject(new Error(msg));
  return deferred.promise;
}

/**
 * @param promise   
 * @returns function(err, data) that will resolve the promise
 */
function callbackFromPromise(promise) {
  return function(err, res) {
    if (err)
      promise.reject(err);
    else
      promise.resolve(res);
  }
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

function fileMd5(filename) {
  var deferred = promise.Deferred();
  var md5 = crypto.createHash('md5');

  var s = fs.ReadStream(filename)
    .on('data', function(d) { md5.update(d); })
    .on('end', function() {
      deferred.resolve( md5.digest('hex'));
    })
    .on('error', function(err) {
      deferred.reject(err);
    });
  return deferred.promise;
}

/**
 * @returns host ip, ex: 123.24.24.1. If multiple, returns 1st one found
 * @throws error if none
 */
function hostIp() {
  var ifaces=os.networkInterfaces();
  for (var netCode in ifaces) {
    var good = ifaces[netCode].filter( function( details ) { 
        return details.family == 'IPv4' && !details.internal 
      });
    if (good.length > 0)
      return good[0].address;
  }
  console.error(ifaces);
  throw new Error("hostIp not found." + ifaces);
}

module.exports = {
  fileCopy: fileCopy,
  invertPromise: invertPromise,
  printPromise: printPromise,
  createRejectedPromise: createRejectedPromise,
  randomString: randomString,
  fileMd5: fileMd5,
  hostIp: hostIp,
  callbackFromPromise: callbackFromPromise
}

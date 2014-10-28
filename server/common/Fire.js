"use strict";

if (!process.env['FIREBASE_SECRET'] || !process.env['FIREBASE_URL'])
  throw new Error("env FIREBASE_SECRET | FIREBASE_URL not defined");

var debug = require('debug')('pook:firebase');
var async = require('async');

var Firebase = require("firebase");
var FirebaseTokenGenerator = require("firebase-token-generator");

var ref = new Firebase(process.env['FIREBASE_URL']);
var usersRef = ref.child('users');

// 
function reportError(msg) {
  return function(err) {
    if (err)
      debug("ERROR: ", msg, err);
  }
};

function shareBook(bookId, shareWithUid, startOrStop) {
  var bookRef = ref.child('books').child(bookId).child('sharing');
  if (startOrStop == 'stop') {
    bookRef.child(shareWithUid).remove( 
      reportError('stopping the share'));
  }
  else {
    var shareRec = {};
    shareRec[shareWithUid] = true;
    bookRef.update( shareRec, reportError('starting sharing'));
    debug('book shared');
  }
}

function requestShareWatcher() {
  var requestShareBookRef = ref.child('requestShareBook');
  requestShareBookRef.on('child_added', function(snapshot) {
    var request = snapshot.val();
    debug('share book request received', request.shareWith);

    // remove the request
    requestShareBookRef.ref().remove( reportError("request share remove"));

    // find user
    usersRef
      .orderBy('email')
      .startAt(request.shareWith)
      .endAt(request.shareWith)
      .limitToFirst(1)
      .once('value', function(snapshot) {
        var user = snapshot.val();
        if (!user)
          return debug("Could not share with ", request.shareWith, ". User not found");
        request.shareWithUid = Object.keys(user)[0];
        shareBook(request.bookId, Object.keys(user)[0], request.type);
      });
  });
}
// Watch database, and perform actions
function initWatchers() {
  requestShareWatcher();
}

// Connect to Firebase server
function init() {
  var tokenGenerator = new FirebaseTokenGenerator(process.env['FIREBASE_SECRET']);
  var token = tokenGenerator.createToken({ uid: "1"}, { admin: true});
  ref.authWithCustomToken(token, function(err, authData) {
    if (err)
      debug('Firebase login failed', err);
    else {
      debug('Firebase ready');
      initWatchers();
    }
  });
};

init();
// authenticate, then watch something
module.exports = {

}

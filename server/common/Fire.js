"use strict";

if (!process.env['FIREBASE_SECRET'])
  throw new Error("env FIREBASE_SECRET not defined");

var debug = require('debug')('pook:firebase');
var async = require('async');

var Firebase = require("firebase");
var FirebaseTokenGenerator = require("firebase-token-generator");

var commonUtils = require("../../browser/elements/commonUtils.js");

var ref = new Firebase(commonUtils.firebaseLoc);
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

function notifyUser(uid, type, message) {
  var notificationRef = new Firebase( commonUtils.getFirebaseUrl('notifications',uid));
  notificationRef.push( {
    type: type,
    message: message
  }, reportError("notifying user"));
}

/*
 * @param <Function> callback listens to firebase 'value' event on the query
 */
function findUserByEmail(email, callback) {
  (new Firebase( commonUtils.getFirebaseUrl('allUsers')))
    .orderByChild('email')
    .startAt(email)
    .endAt(email)
    .limitToFirst(1)
    .once('value', callback);
}
/*
 * @param <Function> callback fn(err), err message can be shown to the user
 */
function processStartSharing(request, callback) {
  findUserByEmail( request.shareWith, function(snapshot) {
    var users = snapshot.val();
    // TODO in the future, invite the non-existent user to read the book through email
    if (!users)
      return callback( new Error(request.shareWith + " is not registered with pook.io. In the future, we'll be able to do this."));

    var shareWithId = Object.keys(users)[0];
    debug("Target user for sharing is", shareWithId);
    var targetUserRef = new Firebase( commonUtils.getFirebaseUrl('user', shareWithId));
    targetUserRef.child('booksSharedWithMe').child(request.bookId).set(true);

    var bookRef = new Firebase( commonUtils.getFirebaseUrl('oneBook', request.bookId));
    bookRef.child("sharedWith").child(shareWithId).set(true);

    callback();
  });
}

function processStopSharing(request, callback) {
  var targetUserRef = new Firebase(commonUtils.getFirebaseUrl('user', request.shareWith));
  targetUserRef.child('booksSharedWithMe').child(request.bookId).remove();

  var bookRef = new Firebase( commonUtils.getFirebaseUrl('oneBook', request.bookId));
  bookRef.child("sharedWith").child(request.shareWith).remove();

  callback();
}
function initShareWatcher() {
  var shareRef = new Firebase( commonUtils.getFirebaseUrl( 'requestShareBook'));

  shareRef.on('child_added', function(snapshot) {
    var request = snapshot.val();
    
    // delete the request
    shareRef.child( snapshot.key()).remove();

    switch( request.type) {
      case 'start':
        processStartSharing(request, function(err) {
          if (err)
            notifyUser(request.madeBy, "error", "Error while sharing book with " + request.shareWith + ". " + err.message);
          else
            notifyUser(request.madeBy, "message", "your book has been shared successfully");
        });
        break;
      case 'stop':
        processStopSharing(request, function(err) {
          if (err)
            notifyUser(request.madeBy, "error", "Error while stopping sharing book with " + request.shareWith + err.message);
          else
            notifyUser(request.madeBy, "message", "Stopped sharing successfully");
        });
        break;
      default:
        debug('error processing sharing request: bad request type' + request.type);
    }
    debug('share book request received', request.shareWith);
    debug('request key', snapshot.key());
  });
}
// Watch database, and perform actions
function initWatchers() {
  initShareWatcher();
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

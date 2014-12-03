
describe('firebase', function() {

  // Firebase.enableLogging(true);
  var ref = new Firebase(TestUtils.firebaseLoc);

  var goodCred = {
    email: "good@test.com",
    password: "12345678",
    uid: null
  };

  var badCred = {
    email: "bad@test.com",
    password: "12345678"
  };

  var photoPrototype = {
    createdAt: Firebase.ServerValue.TIMESTAMP,
    displayName: "One",
    s3: "s3id",
    width: 200,
    height: 200,
    dateTaken: '11-24-2005',
    caption: 'oh caption, my caption',
    latitude: 15,
    longitude: 20,
    latitudeRef: 'latRef',
    longitudeRef: 'longRef'
  };

  function createAccount(cred, done, userProps) {
    async.waterfall([
      function createUser(cb) {
        ref.createUser( cred, function(err) {
          if (err) console.warn('createAccount fail, proceeding anyway ', cred.email);
          cb();
        });
      },
      function login(cb) {
        ref.authWithPassword(cred, cb);
      },
      function createDbUser(auth, cb) {
        var a = ref.getAuth();
        userRef = ref.child('users').child(a.auth.uid);
        var user = TestUtils.extend( {
          createdAt: Firebase.ServerValue.TIMESTAMP,
          email: cred.email
        }, userProps);
        userRef.update( user, cb);
      }
      ],
      function complete(err, result) {
        done(err);
      }
    );
  }

  function deleteAccount(cred, done) {
    async.waterfall([
        function login(cb) {
          ref.authWithPassword(cred, cb);
        },
        function deleteUserRecord(ignore, cb) {
          var auth = ref.getAuth();
          ref.child('users').child(auth.uid).remove(cb);
        },
        function deleteUserPhotos(ignore, cb) {
          var auth = ref.getAuth();
          ref.child('photos').child(auth.uid).remove(cb);
        },
        function deleteUserBooks(ignore, cb) {
          console.log('deleting books');
          var auth = ref.getAuth();
          ref.child('books').child(auth.uid).remove(cb);
        },
        function deleteUserAuth(ignore, cb) {
          ref.removeUser(cred, cb);
        }
      ],
      function complete(err) {
        if (err)
          console.warn('Error deleting account', cred.email);
        done(err);
      }
    );
  }

  // callback(err, bookRef)
  function createBook(uid, callback, bookProps) {
    var bookJs = TestUtils.extend( {
      title: "new book",
      createdAt: 0,
      info: {
        width: 8,
        height: 11.5
      }
    }, bookProps);
    bookRef = ref.child('books').child(uid).push();
    bookRef.update(bookJs, function(err) {
        callback(err, bookRef);
    });
  }
  /********************************************
   * SETUP
   ********************************************/

  // create good guy, bad guy accounts
  before( function(done) {
    this.timeout(10*1000);
    async.waterfall([
      function createGood(cb) {
        createAccount(goodCred, cb, {firstName: "Good", lastName: "Fella"});
      },
      function createBad(cb) {
        goodCred.uid = ref.getAuth().uid;
        createAccount(badCred,cb, {firstName: "Bad", lastName: "Boyo"});
      },
      function badDone(cb) {
        badCred.uid = ref.getAuth().uid;
        cb();
      }
      ],
      function complete(err, results) {
        done(err);
      }
    );
  });

  // remove good guy, bad guy accounts
  after( function(done) {
    this.timeout(10*1000);
    async.waterfall([
        function deleteGood(cb) {
          deleteAccount(goodCred, cb);
        },
        function deleteBad(cb) {
          deleteAccount(badCred,cb);
        }
      ],
      function complete(err, results) {
        if (err)
          console.error("could not clean up good and bad users", err);
        done(err);
      }
    );
  });

  /******************************
   * TESTS
   ******************************/
  it("#registerUser", function(done) {
    this.timeout(10*1000);
    var testCred = {
      email: TestUtils.randomString(6) + "@test.org",
      password: '12345678'
    };
    var userRef;
    async.waterfall([
        function create(cb) {
          createAccount(testCred, cb);
        },
        function del(cb) {
          deleteAccount(testCred, cb);
        }
      ],
      function final(err, result) {
        if (err)
          console.error("unexpected error:", err, "\nDelete user ", credentials.email, credentials.password);
        done(err);
      }
    );
  });

  it("#modifyAccount", function(done) {
    this.timeout(10*1000);
    async.waterfall([
        function login(cb) {
          ref.authWithPassword(goodCred, cb);
        },
        function modify(authData, cb) {
          var auth = ref.getAuth();
          var accountRef = ref.child('users').child(auth.uid).child('account');
          accountRef.update( {
            zip: '94303'
          }, cb);
        },
      ],
      function complete(err, result) {
        done(err);
      }
    );
  });

  it.skip("#modifyAccount BADGUY", function(done) {
    async.waterfall([
        function login(cb) {
          ref.authWithPassword(badCred, cb);
        },
        function modify(ignore, cb) {
          var accountRef = ref.child('users').child(goodCred.uid).child('account');
          accountRef.update( {
            zip: 'BAAAD'
          }, function(err) {
            if (err)
              cb();
            else
              cb(new Error("Bad user was able to write to good user's account"));
          });
        }
      ],
      function complete(err) {
        done();
      }
    );
  });

  it("#readFirstLast as public", function(done) {
    async.waterfall([
        function login(cb) {
          ref.authWithPassword(badCred, cb);
        },
        function getFirst(ignore, cb) {
          var firstRef = ref.child('users').child(goodCred.uid).child('firstName');
          firstRef.once('value', 
            function(snap) {
              if (snap.val() != "Good")
                cb(new Error('got bad value' + snap.val()));
              else
                cb();
            }, 
            function(err) {
              console.log("Got error reading name", err);
            }
          );
        }
      ],
      function complete(err, result) {
        if (err)
          done(err);
        else
          done();
      }
    );
  });

  it("#createPhotos", function(done) {
    var photos = [];
    for (var i=0; i<5; i++) { // create list of 5 photos
      var newPhoto = JSON.parse(JSON.stringify(photoPrototype));
      newPhoto.displayName = TestUtils.randomString(10);
      photos.push(newPhoto);
    }
    async.waterfall([
        function login(cb) {
          ref.authWithPassword(goodCred, cb);
        },
        function addPhoto(ignore, cb) {
          var photosRef = ref.child('photos').child(goodCred.uid);
          async.each(photos, function(p) {  // add all photos in parallel
            var pRef = photosRef.push(p, cb);
          }, cb);
        }
      ],
      function complete(err,res) {
        done(err);
      }
    );
  });

  it.skip("#createPhotos BADGUY", function(done) {
    async.waterfall([
        function login(cb) { 
          ref.authWithPassword(badCred, cb);
        },
        function addPhoto(ignore, cb) {
          var photosRef = ref.child('photos').child(goodCred.uid);
          photosRef.push(photoPrototype, function(err) {
            if (err)
              cb();
            else 
              cb(new Error('bad guy was able to add photos'));
          });
        }
      ],
      function complete(err) {
       done(err);
      } 
    );
  });

  it("#listPhotos", function(done) {
    async.waterfall([
        function login(cb) {
          ref.authWithPassword(goodCred, cb);
        },
        function list(ignore, cb) {
          var photosRef = ref.child('photos').child(goodCred.uid);
          photosRef.once('value', function(snapshot) {
            var v = snapshot.val();
            var i = 0;
            for (k in v) {
              // console.log(k);
              i++;
            }
            if (i < 5)
              cb(new Error('not enough photos ' +i ));
            else
              cb();
          });
        }
      ],
      function complete(err) {
        done(err);
      }
    );
  });

  it.skip("#listPhotos BADGUY", function(done) {
    async.waterfall([
        function login(cb) {
          ref.authWithPassword(badCred, cb);
        },
        function list(ignore, cb) {
          var photosRef = ref.child('photos').child(goodCred.uid);
          photosRef.on('value', 
            function(snapshot) {
              cb(new Error('accessed photos without permission ' ));
            },
            function cancelCallback(err) {
              cb();
            }
          );
        }
      ],
      function complete(err) {
        done(err);
      }
    );
  });

  it('#createBook', function(done) {
    async.waterfall([
      function login(cb) {
        ref.authWithPassword(goodCred, cb);
      },
      function myCreateBook(ignore, cb) {
        createBook(goodCred.uid, cb);
      },
      function deleteBook(bookRef, cb) {
        cb();
//        bookRef.remove(cb);
      }
      ],
      function complete(err) {
        done(err);
      }
    )
  });

  it.skip('#createShareBookRequest', function(done) {
    this.timeout(10*1000);
    var shareRequestRef;
    var bookRef;
    async.waterfall([
        function login(cb) {
          ref.authWithPassword(goodCred, cb);
        },
        function myCreateBook(ignore, cb) {
          createBook(goodCred.uid, cb);
        },
        function shareBook(myBookRef, cb) {
          bookRef = myBookRef;
          var shareRef = ref.child('requestShareBook');
          var share = {
            type: 'start',
            madeBy: goodCred.uid,
            bookId: goodCred.uid + "/" + bookRef.name(),
            shareWith: "bad@test.com"
          };
          shareRequestRef = shareRef.push( share, cb);
        },
        function shareDone(ingore,cb) {
          bookRef.child('sharing').once('child_added', function(snapshot) {
            if (badCred.uid == snapshot.name())
              cb();
            else 
              cb(new Error('sharing bits not set on a book'));
          });
        },
        function removeBook(cb) {
          bookRef.remove(cb);
        }
      ],
      function complete(err) {
        done(err);
      }
    );
  });

  it.skip('#shareBook', function() {
    
  });

  it.skip('#shareBook BADGUY', function() {
  });

});


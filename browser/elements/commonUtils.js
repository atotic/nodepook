/**
 * @class CommonUtils
 * @group utilities
 *
 * Utilities common to browser and server
 */
(function(exports) {
    /**
     * @property firebaseLoc
     * Firebase base url global
     */
    exports.firebaseLoc = "https://torid-inferno-6070.firebaseio.com/";
    /**
     * @property s3url
     * s3 storage global
     */
    exports.s3url = "http://pookio-test.s3-website-us-west-2.amazonaws.com/";
    
    /**
     * @method noop
     * null function
     */
    exports.noop =  function() {};
    /**
     * @method noope
     * noop that logs errors
     */
    exports.noope = function(err) {
      if (err)
        console.error("Unexpected error:", err);
    };

   /**
     * @method getFirebaseUrl
     * @param {String} type user account myPhotos myBooks onePhoto oneBook allBooks allPhotos
     * @param {String} id ids for path, see source for exact meaning
     * returns String suitable for new Firebase(str)
     */
    exports.getFirebaseUrl = function(type, id, id2) {
      switch(type) {
        case 'user':
          return this.firebaseLoc + "users/" + id;
        case 'account':
          return this.firebaseLoc + "users/" + id + "/account";
        case 'myPhotos':
          return this.firebaseLoc + "users/" + id + "/myPhotos";
        case 'myBooks':
          return this.firebaseLoc + "users/" + id + "/myBooks";
        case 'booksSharedWithMe':
          return this.firebaseLoc + "users/" + id + "/booksSharedWithMe";
        case 'notifications':
          return this.firebaseLoc + "users/" + id + "/notifications";
        case 'onePhoto': // id is photoId
          return this.firebaseLoc + "photos/" + id;
        case 'oneBook': // id is bookId
          return this.firebaseLoc + "books/" + id;
        case 'oneNotification': // id is userId, id2 is notiicationId
          return this.firebaseLoc + "users/" + id + "/notifications/" + id2;
        case 'allBooks':
          return this.firebaseLoc + "books";
        case 'allPhotos':
          return this.firebaseLoc + "photos";
        case 'allUsers':
          return this.firebaseLoc + "users";
        case 'requestShareBook':
          return this.firebaseLoc + "requestShareBook";
        default:
          throw new Error("unknown database type " + type);
      }
    };

    /**
     * @method randomString
     * @param {Number} len string length
     * @param {String} charSet optional character set
     *
     * returns a random string
     */
    exports.randomString = function (len, charSet) {
      charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var randomString = '';
      for (var i = 0; i < len; i++) {
          var randomPoz = Math.floor(Math.random() * charSet.length);
          randomString += charSet.substring(randomPoz,randomPoz+1);
      }
      return randomString;
    };

    /**
     * @method ObjectKeys
     * @param {Object || null} obj object whose keys we want
     * Just like `Object.keys`, but can also deal with null
     */
    exports.objectKeys = function(obj) {
      if (obj)
        return Object.keys(obj);
      else
        return [];
    };
    
})(typeof exports === 'undefined' ? this['CommonUtils']={} : exports);

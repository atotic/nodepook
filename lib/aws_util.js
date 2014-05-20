// aws_util.js
// var AWSu = require('../lib/aws_util.js');
var debug = require('debug')('pook:lib:awsutil');

var fs = require('fs');
var promise = require('promised-io/promise');
var AWS = require('aws-sdk');
var FlakeId = require('flake-idgen');
var IntEncoder = require('int-encoder');
var biguint = require('biguint-format');

// configuration
// access keys are stored in AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
// AWS_DEFAULT_REGION does not work for simpleDB
AWS.config.update({region: 'us-west-2'});

function uniqueId() {
  if (! ('flakeIdGen' in global))
    global.flakeIdGen = new FlakeId();
  return IntEncoder.encode( 
    biguint( global.flakeIdGen.next(), 'hex', {prefix: ""}),
    16);
}

function ItemNotFoundError(id) {
  var e = new Error("Item not found");
  e.name = "ItemNotFound";
  e.id = id;
  return e;
}

var services = {
  get s3() {
    if (!('_s3' in this))
      this._s3 = new AWS.S3();
    return this._s3;
  },
  get sdb() {
    if (!('_sdb' in this))
      this._sdb = new AWS.SimpleDB();
    return this._sdb;
  }
}


/*********************
 * S3
 *********************/

function s3connect() {
  return new AWS.S3();
}

function s3listObjects(bucket, prefix) {
  var deferred = new promise.Deferred();
  var params = {
    Bucket: module.exports.s3.buckets[bucket],
    Delimiter: '/'
  }
  if (prefix)
    params.Prefix = prefix;
  services.s3.client.listObjects(params,
    function(err, data) {
      if (err) {
        debug(err, err.stack);
        deferred.reject(err);
      }
      else
        deferred.resolve(data.Contents);
    });
  return deferred.promise;
}

// resolve(putObjectData)
function s3uploadFile(bucket, file, key ) {
  var deferred = new promise.Deferred();
  var reader = fs.createReadStream(file);
  reader.on("error", function(err) { deferred.reject(err) });

  services.s3.client.putObject( { 
      Bucket: module.exports.s3.buckets[bucket], 
      Key: key, 
      Body: reader 
    },
    function(err, data) {
      if (err) {
        debug(err, err.stack);
        deferred.reject(err);
      }
      else
        deferred.resolve(data);
    }
  );
  return deferred.promise;
}

// resolve(deleteObjectData)
function s3deleteKey(bucket, key) {
  var deferred = new promise.Deferred();
  services.s3.client.deleteObject( { 
      Bucket: module.exports.s3.buckets[bucket], 
      Key: key
    }, 
    function(err, data) {
      if (err) {
        debug(err, err.stack);
        deferred.reject(err);
      }
      else
        deferred.resolve(data);
    });
  return deferred.promise;
}

/**********************
 * SimpleDB
 **********************/

function sdbConnect() {
  return new AWS.SimpleDB();
}


// resolve(createDomainData)
function sdbCreateDomain(name) {
  var deferred = new promise.Deferred();
  services.sdb.createDomain( { DomainName: name }, function(err, data) {
    if (err) {
      debug(err, err.stack);
      deferred.reject(err);
    }
    else
      deferred.resolve(data);
  });
  return deferred.promise;
}

function sdbDeleteDomain(domain) {
  var deferred = new promise.Deferred();
  services.sdb.deleteDomain( { DomainName:  module.exports.sdb.domains[domain] }, function(err, data) {
    if (err) {
      debug(err, err.stack);
      deferred.reject(err);
    }
    else
      deferred.resolve(data);
  });
  return deferred.promise;
}

function sdbListDomains() {
  var deferred = new promise.Deferred();
  services.sdb.listDomains({}, function(err, data) {
    if (err) {
      debug(err, err.stack);
      deferred.reject(err);
    }
    else
      deferred.resolve(data);
  });
  return deferred.promise;
}

function sdbCreateItem(domain, itemName, attributes) {
  var deferred = new promise.Deferred();

  var params = {
    DomainName: module.exports.sdb.domains[domain],
    ItemName: itemName || sdbUniqueId(),
    Attributes: []
  };
  for (var a in attributes) {
    if (attributes[a] !== undefined)  // do not write out undefined params
      params.Attributes.push( { 
        Name: a,
        Value: String(attributes[a])
      });
  }
  // guard against creating an item that already exists
  if (params.Attributes.length > 0)
    params.Expected = { 
      Name: params.Attributes[0].Name,
      Exists: false
    };

  services.sdb.putAttributes(params, function(err, data) {
    if (err) {
      // debug(err, err.stack);
      deferred.reject(err);
    }
    else
      deferred.resolve(data);
  });
  return deferred.promise;
}

function sdbAttributesToObject(attr, itemName) {
  var o = {};
  if (itemName)
    o.itemId = itemName;
  attr.forEach( function(prop) {
    o[ prop.Name] = prop.Value;
  });
  return o;
}

function sdbReadItem(domain, itemName) {
  return promise.seq([
      function() { 
        return sdbSelect(
          'select * from ' + module.exports.sdb.domains[domain] 
          + ' where itemName() = "' + itemName + '"');
      },
      function(data) {
        if ('Items' in data && data.Items.length > 0) {
          return sdbAttributesToObject( data.Items[0].Attributes, itemName);
        }
        else
          throw new ItemNotFoundError(domain + ':' + itemName);
      }
    ]);
}

function sdbDeleteItem(domain, itemName) {
  var deferred = new promise.Deferred();
  var params = {
    DomainName: module.exports.sdb.domains[domain],
    ItemName: itemName,
    Attributes:[]
  }
  services.sdb.deleteAttributes(params, function(err, data) {
    if (err) {
      debug(err, err.stack);
      deferred.reject(err);
    }
    else
      deferred.resolve(data);
  });
  return deferred.promise;
}

function sdbSelect(expression) {
  var deferred = new promise.Deferred();
  var params = {
    SelectExpression: expression,
    ConsistentRead: true
  };
  // console.log("Expression", expression);
  services.sdb.select(params, function(err, data) {
    if (err) {
      debug(err, err.stack);
      deferred.reject(err);
    }
    else
      deferred.resolve(data);
  });
  return deferred.promise;  
}

module.exports = {
  uniqueId: uniqueId,
  ItemNotFoundError: ItemNotFoundError,
  s3: {
    /**
     * Bucket naming:
     */
    buckets: {
      photos: 'pookio-test',
      books: 'pookio-test',
      test: 'pookio-test'
    },
    connect: s3connect,
    listObjects: s3listObjects,
    uploadFile: s3uploadFile,
    deleteKey: s3deleteKey
  },
  sdb: {
    domains: { // all our domains
      photos: 'photos',
      users: 'users',
      test: 'test'
    },
    connect: sdbConnect,

    createDomain: sdbCreateDomain,
    deleteDomain: sdbDeleteDomain,
    listDomains: sdbListDomains,
    select: sdbSelect,
    createItem: sdbCreateItem,
    readItem: sdbReadItem,
    deleteItem: sdbDeleteItem
  }
}

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

// Access keys are set in ~/.aws/credentials
// SimpleDB requires region to be set manually
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
  },
  get metadata() {
    if (!('_metadata') in this)
      this._metadata = new AWS.MetadataService();
    return this._metadata;
  }
}


/*********************
 * S3
 *********************/

function s3connect() {
  return new AWS.S3();
}

function s3HeadObject(bucket, key) {
  var deferred = new promise.Deferred();
  // debug('headObject');
  services.s3.client.headObject({
    Bucket: module.exports.s3.buckets[bucket],
    Key: key
    }, 
    function(err, data) {
      if (err)
        deferred.reject(err);
      else
        deferred.resolve(data);
    }
  );
  return deferred.promise;
}

function s3GetObject(bucket, key) {
  var deferred = new promise.Deferred();
  services.s3.client.getObject({
    Bucket: module.exports.s3.buckets[bucket],
    Key: key
    },
    function(err, data) {
      if (err)
        deferred.reject(err);
      else
        deferred.resolve(data);
    }
  );
  return deferred.promise;
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

/**
 * @param params, s3.putObject params (Key, Body, ContentType, Metadata)
 * {@link http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property}
 * @returns resolve(putObjectData) 
 */
function s3putObject(bucket, params) {
  var deferred = new promise.Deferred();
  params.Bucket = module.exports.s3.buckets[bucket];
  services.s3.client.putObject(
    params,
    function(err, data) {
      if (err)
        deferred.reject(err);
      else
        deferred.resolve(data);
    }
  );
  return deferred.promise;
}

/** returns  resolve(deleteObjectData) */
function s3deleteObject(bucket, key) {
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
 * Metadata
 **********************/

function metadataConnect() {
  return new AWS.MetadataService();
}
function metadataRequest(path) {
  var deferred = new promise.Deferred();
  services.metadata.request(path, function(err, data) {
    if (err) {
      console.log(err);
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

    debug('params',params);
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
    ItemName: itemName
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
    headObject: s3HeadObject,
    getObject: s3GetObject,
    listObjects: s3listObjects,
    putObject: s3putObject,
    deleteObject: s3deleteObject
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
  },
  metadata: {
    connect: metadataConnect,
    request: metadataRequest
  }
}

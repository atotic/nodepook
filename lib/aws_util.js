// aws_util.js
// var AWSu = require('../lib/aws_util.js');
var debug = require('debug')('pook:lib:awsutil');

var AWS = require('aws-sdk');
var biguint = require('biguint-format');
var FlakeId = require('flake-idgen');
var fs = require('fs');
var IntEncoder = require('int-encoder');

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
  var e = new Error("Item not found " + id);
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
    if (!('_metadata' in this))
      this._metadata = new AWS.MetadataService();
    return this._metadata;
  }
}


/*********************
 * S3
 *********************/

/**
 * @param params, s3.putObject params (Key, Body, ContentType, Metadata)
 * {@link http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property}
 * @returns resolve(putObjectData)
 */


/**********************
 * SimpleDB
 **********************/

 /** @returns object in aws attribute format [ { Name: , Value: }*] */
function sdbObjectToAttributes(o) {
  var attributes = [];
  for (var a in o) {
    if (o[a] !== undefined)  // do not write out undefined params
      attributes.push( { Name: a, Value: String(attributes[a]) } );
  }
  return attributes;
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

/** @returns single sdb item as javascript object */
function sdbReadItem(domain, itemName, done) {
  services.sdb.select(
    {
      SelectExpression:  'select * from ' + domain + ' where itemName() = "' + itemName + '"',
      ConsistentRead: true
    },
    function(err, data) {
      // debug("sdbReadItem", data);
      if (err)
        done(err);
      else if ('Items' in data && data.Items.length > 0)
        done( null, sdbAttributesToObject(data.Items[0].Attributes, itemName));
      else
        done( new ItemNotFoundError(domain + ':' + itemName) );
    }
  );
}


module.exports = {
  uniqueId: uniqueId,
  buckets: {
    photos: 'pookio-test',
    books: 'pookio-test',
    test: 'pookio-test'
  },
  domains: { // all our domains
    photos: 'photos',
    users: 'users',
    test: 'test'
  },
  objectToAttributes: sdbObjectToAttributes,
  attributesToObject: sdbAttributesToObject,
  sdbReadItem: sdbReadItem,
  get s3() { return services.s3 },
  get sdb() { return services.sdb },
  get metadata() { return services.metadata }
}

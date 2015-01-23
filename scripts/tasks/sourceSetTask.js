#! /usr/bin/env node

/**
 * creates sourceSet.json 
 */
var fs = require('fs');

var sourceSet = {
  Documents: [],
  Elements: [],
  Tests: ["/test/index.html"],
  Bower: ["/vendor/firebase-elements/firebase-element.html"],
  References: [
    "http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/",
    "http://iamralpht.github.io/physics/",
    "http://aws.amazon.com/ses/"
  ]
}

var ignores = [];

function ignoreName(name) {
  return ignores.some(function(p) { name.match(p) });
}

var docFolder = "browser/docs";
var elementsFolder = "browser/elements";
var bowerFolder = "browser/vendor";

var docRoot = "/docs";
var docFiles = fs.readdirSync(docFolder);
ignores = ["index.html"];

docFiles.forEach(function(name) {
  if (ignoreName(name)) return;
  sourceSet.Documents.push(docRoot + "/" + name);
});

var elementRoot = "/elements";
var elementFiles = fs.readdirSync(elementsFolder);
elementFiles.forEach( function(name) {
  if (ignoreName(name)) return;
  if (name.match(/\.html$/i) || name.match(/\.js$/i))
    sourceSet.Elements.push( elementRoot + "/" + name);
});

var bowerFolders = fs.readdirSync(bowerFolder);
var bowerRoot = "/vendor/";

// assume every folder that contains <folder_name>.html file
// is a polymer element
bowerFolders.forEach( function(folder) {
  var stat = fs.statSync(bowerFolder + "/" + folder);
  if (!stat.isDirectory())
    return;
  var polyFile = folder + "/" + folder + ".html";
  try {
    var stat = fs.statSync(bowerFolder + "/" + polyFile);
    if (stat)
      sourceSet.Bower.push( bowerRoot + polyFile);
  }
  catch(ex) {
    // console.log(ex.message);
  } 
});

console.log(JSON.stringify(sourceSet, null, "  "));

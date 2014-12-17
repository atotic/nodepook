#! /usr/bin/env node

/**
 
 */
var fs = require('fs');

var sourceSet = {
  Documents: [],
  Elements: [],
  Tests: ["test/index.html"],
  Bower: [],
  References: [
  ]
}
var docFolder = "browser/docs";
var elementsFolder = "browser/elements";
var bowerFolder = "browser/vendor";

var docRoot = "/docs";
var docFiles = fs.readdirSync(docFolder);
docFiles.forEach(function(name) {
  sourceSet.Documents.push(docRoot + "/" + name);
});

var elementRoot = "/elements";
var elementFiles = fs.readdirSync(elementsFolder);
elementFiles.forEach( function(name) {
  if (name.match(/\.html$/i))
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

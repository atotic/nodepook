// exif-worker
// postMessage("I\'m working before postMessage");

importScripts('/vendor/jdataview/dist/browser/jdataview.js');

// Profiled, very fast 12ms in chrome
function parseLocalFile(file, photoId) {
  // console.profile("parseLocal");
  // only read first 128k for performance
  var fileSlice = sliceFile(file, 128 * 1024);
  var reader = new FileReaderSync();
  var buffer = reader.readAsArrayBuffer(fileSlice);
  // console.log('file read');
  var parser = new ExifParser(buffer);
  parser.readMetadata();
  var exifData = parser.exif;
  exifData.displayName = file.name;
  // console.profileEnd();
  postMessage({action: 'parsed', exif: exifData, photoId: photoId });
}

function sliceFile(file, size) {
  var filePart = null;
  if ('slice' in file)
    filePart = file.slice(0, size);
  else if ('webkitSlice' in localFile)
    filePart = file.webkitSlice(0, size);
  else if ('mozSlice' in localFile)
    filePart = file.mozSlice(0, size);
  else
    filePart = file;
  return filePart;
}

var ExifParser = function(arrayBuffer) {
  this.buffer = arrayBuffer;
  this.exif = {
    orientation: 1,
    dateTime: null,
    dateTimeOriginal: null,
    description: null,
    title: null,
    userComment: null,
    thumbnail_url: null // data: url
  };
};

ExifParser.prototype = {
  get caption() {
    return this.exif.description || this.exif.title || this.exif.userComment;
  },
  get dateTime() {
    return this.exif.dateTimeOriginal || this.exif.dateTime;
  },
  get jsDate() {
    if ('_jsDate' in this)
      return this._jsDate;
    if (!this.dateTime)
      return null;
    try {
      var m = this.dateTime.match(/(\d+):(\d+):(\d+) (\d+):(\d+):(\d+)/);
      if (m)
        this._jsDate = new Date(m[1], m[2], m[3], m[4], m[5], m[6]);
      else
        this._jsDate = null;
    }
    catch(ex) {
      console.warn("could not parse exif date", this.dateTime);
    }
    return this._jsDate;
  },
  readTagValue: function(tiffStart, offset, littleEndian) {
    var type = this.view.getUint16(offset+2, littleEndian);
    var numValues = this.view.getUint32(offset+4, littleEndian);
    var dataValue = this.view.getUint32(offset+8, littleEndian);
//    console.log(type, numValues, dataValue);
    switch(type) {
      case 2: // string
        var stringOffset = numValues > 4 ? dataValue + tiffStart : offset + 8;
        return this.view.getString(numValues-1, stringOffset);
      case 3: // Uint16
        return this.view.getUint16(offset+8, littleEndian);
      case 4:
        return this.view.getUint32(offset+8, littleEndian);
      case 7: // unclear. When encountered, lots of 0s
      /*
        if (numValues == 1)
          return this.view.getUint8(offset + 8, littleEndian);
        else {
          var valOffset = numValues > 4 ? dataValue + tiffStart : offset + 8;
          var aVals = [];
          for (var i=0; i < numValues; i++)
            aVals[i] = this.view.getUint8(valOffset + i, littleEndian);
        return aVals;
        }
        */
        break;
      default:
        console.warn("Trying to read unknown tag type", type);
        return null;
    }
  },
  readIFD: function(tiffOffset, ifdOffset, littleEndian, isThumbnail) {
    var tagCount = this.view.getUint16(ifdOffset, littleEndian);
    var tags = {};
    var thumbnail = {
      compression: null,
      jpegIfOffset: null,
      jpegIfByteCount: null
    };
    // exif2 -Pkv -g <tagName> fileName
    for (var i=0; i<tagCount; i++) {
      var tagOffset = ifdOffset + i*12 + 2;
      var tagId = this.view.getUint16(tagOffset, littleEndian);
      switch (tagId) {
        case 0x8769: // ExifIFDPointer
//            console.log("ExifIDPointer");
          var exifPtr = this.readTagValue(tiffOffset, tagOffset, littleEndian);
          var newExifOffset = tiffOffset + exifPtr;
          this.readIFD(tiffOffset, newExifOffset, littleEndian);
          break;
        case 0x0112: // Exif.Image.Orientation
//            console.log("Orientation");
          this.exif.orientation = this.readTagValue(tiffOffset, tagOffset, littleEndian);
          break;
        case 0x9003: // Exif.Photo.DateTimeOriginal
          this.exif.dateTimeOriginal = this.readTagValue(tiffOffset, tagOffset, littleEndian);
          break;
        case 0x0132: // Exif.Image.DateTime
          this.exif.dateTime = this.readTagValue(tiffOffset, tagOffset, littleEndian);
          break;
        case 0x9003: // Exif.Photo.DateTimeOriginal
          this.exif.dateTimeOriginal = this.readTagValue(tiffOffset, tagOffset, littleEndian);
          break;
        case 0x9286: // UserComment
//            console.log("UserComment");
          this.exif.userComment = this.readTagValue(tiffOffset, tagOffset, littleEndian);
          break;
        case 0x0103: // Compression
          thumbnail.compression = this.readTagValue(tiffOffset, tagOffset, littleEndian);
          break;
        case 0x0201: // JpegIFOffset
          thumbnail.jpegIfOffset = this.readTagValue(tiffOffset, tagOffset, littleEndian);
          break;
        case 0x0202: // JpegIFByteCount
          thumbnail.jpegIfByteCount = this.readTagValue(tiffOffset, tagOffset, littleEndian);
          break;
        default:
          ;//console.warn("Unknown tag", tagId.toString(16));
      };
    }
    if (isThumbnail) {
      if (thumbnail.compression == 6 && thumbnail.jpegIfOffset && thumbnail.jpegIfByteCount) {
        // Thumbnail extraction http://code.flickr.com/blog/2012/06/01/parsing-exif-client-side-using-javascript-2/
        var data = new Uint8Array(this.view.buffer, thumbnail.jpegIfOffset+tiffOffset,thumbnail.jpegIfByteCount);
        var hexData = [];
        for(var i=0; i<data.length; i++) {
          var val = data[i];
          if (val < 16)
            hexData[i] = "0"+val.toString(16);
          else
            hexData[i] = val.toString(16);
        }
        this.exif.thumbnail_url = "data:image/jpeg,%"+hexData.join('%');
      }
    }
    return this.view.getUint32(ifdOffset + tagCount*12 + 2, littleEndian);
  },
  readExifData: function(offset) {
    var littleEndian;
    if (this.view.getString(4, offset) != 'Exif')
      return;// console.log("Invalid EXIF data");
    offset += 4;
    offset += 2;  // 00
    var tiffStart = offset;
    var endianess = this.view.getUint16(offset);
    offset += 2;
    if (endianess == 0x4949)
      littleEndian = true;
    else if (endianess == 0x4D4D)
      littleEndian = false;
    else
      return console.log("Invalid EXIF: unexpected endian codes", endianess);
    if (this.view.getUint16(offset, littleEndian) != 0x002A)
      return console.log("Invalid EXIF: no 002A");
    offset += 2;
    var ifdOffset = this.view.getUint32(offset, littleEndian);
    var ifdStart = tiffStart + ifdOffset;
    offset += 4;
    var thumbnailIfdOffset = this.readIFD(tiffStart, ifdStart, littleEndian);
    if (thumbnailIfdOffset)
      this.readIFD(tiffStart, tiffStart + thumbnailIfdOffset, littleEndian, true);
  },
  readRdfValue: function(dom, tag) {
    var retVal = null;
    var tagList = dom.getElementsByTagName(tag);
    if (tagList.length == 0)
      return null;
    var li = tagList.item(0).getElementsByTagName('li');
    if (li.length == 0)
      return null;
    return li.item(0).textContent;
  },
  readXmpData: function(offset, length) {
    try {
      var data = this.view.getString(length, offset);
      var rdf = data.match(/<x:xmpmeta[^>]*>([\s\S]*)<\/x:xmpmeta>/)[1];
      var parser = new DOMParser();
      // FIXME: DOMParser is not available inside web workers
      // Need to use pure js xml parser
      // http://xmljs.sourceforge.net/website/documentation-classicdom.html#nodegetElements
      var dom = parser.parseFromString(rdf, "application/xml");
      if (!dom)
        throw new Error("Could not parse dom");
      var title = this.readRdfValue(dom, 'title');
      if (title)
        this.exif.title = title;
      var description = this.readRdfValue(dom, 'description');
      if (description)
        this.exif.description = description;
    }
    catch(ex) {
      // FIXME: this is always in error right now, no DOMParser for Web Workers
      // console.log("Error parsing XMP data", ex.message);
    }
  },
  EXIF_HEADER: 'Exif',
  XMP_HEADER: 'http://ns.adobe.com/xap/1.0/',
  readMetadata: function() {
    this.view = new jDataView(this.buffer);
    var offset = 0;
    if (this.view.getUint8(offset++) != 0xFF || this.view.getUint8(offset++) != 0xD8) {
      console.log("not a jpeg");
      return;
    }
    while (offset < this.view.byteLength) {
//        console.log("offset", (offset).toString(16));
      var markerStart = this.view.getUint8(offset++);
      if ( markerStart != 0xFF) { // Valid marker test
//          console.log("Not a valid marker at offset ", offset, markerStart.toString(16));
        return false; // not a valid marker, something is wrong
      }
      var marker = this.view.getUint8(offset++);
      var length = this.view.getUint16(offset);
//        console.log("marker ", marker.toString(16), "length", length);
      if (marker == 0xE1) {// Exif data marker
        var dataStart = offset + 2;
        if (this.view.getString(4, dataStart) == this.EXIF_HEADER)
          this.readExifData(dataStart);
        else if (this.view.getString(this.XMP_HEADER.length, dataStart) == this.XMP_HEADER)
          this.readXmpData(dataStart, length - 2);
        else
          console.error('unexpected exif part');
        offset += length;
      }
      else
        offset += length;
    }
  }
}

onmessage = function (ev) {
  switch(ev.data.action) {
    case 'parse':
      parseLocalFile(ev.data.file, ev.data.photoId);
      break;
    default: 
      console.warn("unknown message", ev.data);
  }
};

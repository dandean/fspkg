var fs = require('fs');
var path = require('path');
var util = require('util');
var mime = require('mime');
var filter = require('./filter');

function escape(str) {
  // Escape RegExp special characters. Taken from Prototype.js `RegExp.escape`.
  return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

/**
 * class SyncBuilder
 *
 * new SyncBuilder([options])
 * - options (Object): Options to use for the `SyncBuilder` instance.
 *
 * Creates an instance of `SyncBuilder` with the given options.
 *
 * **Options**
 *
 * - format (String): The output format (module, json or object)
 * - filter (String|Function): Filter function or comma-separated
 *     string of file extensions.
**/
function SyncBuilder(options) {
  options = options || {};
  options.format = options.format || 'module';
  
  if (options.filter) {
    if (Object.prototype.toString.call(options.filter) === '[object String]') {
      options.filter = filter.createExtensionFilter(options.filter);
    }
  } else {
    options.filter = filter.Default;
  }
  
  this.options = options;
}

//
// INSTANCE PROPERTIES
//

/**
 * SyncBuilder#build(root) -> String
 * - root (String): The root path of the package.
 *
 * Processes and returns the file-system package at `root`.
**/
SyncBuilder.prototype.build = function(root) {
  var t = this;
  var result = {};
  
  root = path.resolve(root);
  
  var walk = function(current) {
    var stats = fs.statSync(current);
    
    if (stats.isFile() && t.options.filter(current)) {
      
      var ext = path.extname(current);
      
      // Get the processor for the extension, or the default if not found.
      var processor = t.options[ext] || SyncBuilder.Processor[ext] || SyncBuilder.Processor.Default;
      
      // Fix up the path into a normalized object key:
      var key = current
        // Strip out the package root directory...
        .replace(new RegExp('^' + escape(root)), '')
        // Remove leading slash...
        .replace(/^\//, '')
        // Make backslashes forward slashes (windows)
        .replace(/\\/g, '/');
      
      // Read the file content
      var value = processor(current);
      result[key] = value;
      
    } else if (stats.isDirectory()) {
      
      fs.readdirSync(current).forEach(function(name) {
        walk(path.join(current, name))
      });
      
    }
  };
  
  walk(root);
  
  switch (this.options.format) {
    case 'module':
      return 'module.exports = ' + util.inspect(result);
    case 'json':
      return JSON.stringify(result);
    case 'object':
      return result;
    default: throw new Error('`format` is required');
  }
};

//
// CLASS PROPERTIES
//

/**
 * namespace SyncBuilder.Processor
 *
 * A collection of synchronous file processors. Result is returned from each function.
**/
SyncBuilder.Processor = {
  /**
   * SyncBuilder.Processor.Default(path) -> String
   * - path (String): Path to the file to process.
   *
   * Returns a UTF-8 encoded string of the file contents.
  **/
  Default: function(path) {
    return fs.readFileSync(path, 'utf8');    
  },

  /**
   * SyncBuilder.Processor.Base64(path) -> String
   * - path (String): Path to the file to process.
   *
   * Returns a Base64 encoded string of the file contents.
  **/
  Base64: function(path) {
    return fs.readFileSync(path, 'base64');
  },

  /**
   * SyncBuilder.Processor.DataURI(path) -> String
   * - path (String): Path to the file to process.
   *
   * Returns a Base64 encoded Data URI string of the file contents.
  **/
  DataURI: function(path) {
    var mimeType = mime.lookup(path);
    var encoding = mime.charsets.lookup(mimeType);
    
    var result = 'data:' + mimeType;
    if (encoding) result += ';charset=' + encoding;
    result += ';base64,' + SyncBuilder.Processor.Base64(path);
    
    return result;
  }
};

//
// MODULE EXPORT
//

module.exports = SyncBuilder;

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
 * class Builder
 *
 * new Builder([options])
 * - options (Object): Options to use for the `Builder` instance.
 *
 * Creates an instance of `Builder` with the given options.
 *
 * **Options**
 *
 * - format (String): The output format (module, json or object)
 * - filter (String|Function): Filter function or comma-separated
 *     string of file extensions.
**/
function Builder(options) {
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
 * Builder#build(root, cb) -> String
 * - root (String): The root path of the package.
 * - cb (Function(e, result)): Callback function which is given the result.
 *
 * Processes and returns the file-system package at `root`.
**/
Builder.prototype.build = function(root, cb) {
  
  var t = this;
  var result = {};
  
  root = path.resolve(root);
  
  var count = 0;
  
  var walk = function(current) {
    count++;
    fs.stat(current, function(e, stats) {
      if (stats.isFile() && t.options.filter(current)) {
        var ext = path.extname(current);
      
        // Get the processor for the extension, or the default if not found.
        var processor = t.options[ext] || Builder.Processor[ext] || Builder.Processor.Default;
      
        // Fix up the path into a normalized object key:
        var key = current
          // Strip out the package root directory...
          .replace(new RegExp('^' + escape(root)), '')
          // Remove leading slash...
          .replace(/^\//, '')
          // Make backslashes forward slashes (windows)
          .replace(/\\/g, '/');
      
        // Read the file content
        processor(current, function(e, content) {
          result[key] = content;
          checkIfDone('FILE');
        });
      
      } else if (stats.isDirectory()) {
        fs.readdir(current, function(e, files) {
          files.forEach(function(name) {
            walk(path.join(current, name))
          });
          checkIfDone('DIRECTORY');
        });

      } else {
        checkIfDone('FILTERED');
      }

    });
  };
  
  walk(root);
  
  function checkIfDone(source) {
    count--;
    
    if (count === 0) {
      cb = cb || function() {};
    
      switch (t.options.format) {
        case 'module':
          cb(null, 'module.exports = ' + util.inspect(result));
          break;
        case 'json':
          cb(null, JSON.stringify(result));
          break;
        case 'object':
          cb(null, result);
          break;
        default:
          cb(new Error('`format` is required'));
      }
    }
    
  }
};

//
// CLASS PROPERTIES
//

/**
 * namespace Builder.Processor
 *
 * A collection of async file processors. Result is passed to the callback.
**/
Builder.Processor = {
  /**
   * Builder.Processor.Default(path) -> String
   * - path (String): Path to the file to process.
   * - cb (Function(e, result)): Callback function which is given the result.
   *
   * Returns a UTF-8 encoded string of the file contents.
  **/
  Default: function(path, cb) {
    fs.readFile(path, 'utf8', cb);
  },

  /**
   * Builder.Processor.Base64(path) -> String
   * - path (String): Path to the file to process.
   * - cb (Function(e, result)): Callback function which is given the result.
   *
   * Returns a Base64 encoded string of the file contents.
  **/
  Base64: function(path, cb) {
    fs.readFile(path, 'base64', cb);
  },

  /**
   * Builder.Processor.DataURI(path) -> String
   * - path (String): Path to the file to process.
   * - cb (Function(e, result)): Callback function which is given the result.
   *
   * Returns a Base64 encoded Data URI string of the file contents.
  **/
  DataURI: function(path, cb) {
    var mimeType = mime.lookup(path);
    var encoding = mime.charsets.lookup(mimeType);
    
    var result = 'data:' + mimeType;
    if (encoding) result += ';charset=' + encoding;
    result += ';base64,';
    
    Builder.Processor.Base64(path, function(e, content) {
      if (e) {
        cb(e, null);
        return;
      }
      cb(null, result + content);
    });
  }
};

//
// MODULE EXPORT
//

module.exports = Builder;

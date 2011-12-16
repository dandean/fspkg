var fs = require('fs');
var path = require('path');
var util = require('util');
var filter = require('./filter');

function escape(str) {
  return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

/**
 * class SyncBuilder
 *
 * new SyncBuilder([options])
 * - options (Object): Options to use for the `SyncBuilder` instance.
 *
 * Creates an instance of `SyncBuilder` with the given options.
**/
function SyncBuilder(options) {
  options = options || {};
  options.filter = filter.Default;
  options.format = 'module';
  
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
      var processor = SyncBuilder.Processor[ext] || SyncBuilder.Processor.text;
      
      // Remove the pkg root from the path.
      var key = current.replace(new RegExp('^' + escape(root)), '').replace(/^\//, '');
      
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
  text: function(path) {
    return fs.readFileSync(path, 'utf8');    
  }
};

//
// MODULE EXPORT
//

module.exports = SyncBuilder;
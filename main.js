var fs = require('fs');
var path = require('path');
var util = require('util');

function escape(str) {
  return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

/**
 * class Builder
 *
 * new Builder([options])
 * - options (Object): Options to use for the `Builder` instance.
 *
 * Creates an instance of `Builder` with the given options.
**/
function Builder(options) {
  options = options || {};
  options.filter = Builder.DefaultFilter;
  options.format = 'js';
  
  this.options = options;
}


//
// INSTANCE PROPERTIES
//

/**
 * Builder#build(root, cb) -> undefined
 * - root (String): The root path of the package.
 * - cb (Function(e, result)): Callback function which is given the result.
 *
 * Processes the file-system package at `root`.
**/
Builder.prototype.build = function(root, cb) {
};

/**
 * Builder#buildSync(root) -> String
 * - root (String): The root path of the package.
 *
 * Processes and returns the file-system package at `root`.
**/
Builder.prototype.buildSync = function(root) {
  var t = this;
  var result = {};
  
  root = path.resolve(root);
  
  var walk = function(current) {
    var stats = fs.statSync(current);
    
    if (stats.isFile() && t.options.filter(current)) {

      var key = current.replace(new RegExp('^' + escape(root)), '').replace(/^\//, '');
      var value = fs.readFileSync(current, 'utf8');
      result[key] = value;

    } else if (stats.isDirectory()) {
      
      fs.readdirSync(current).forEach(function(name) {
        walk(path.join(current, name))
      });
      
    }
  };
  
  walk(root);
  
  switch (this.options.format) {
    case 'js':
      return 'module.exports = ' + util.inspect(result);
    case 'json':
      return JSON.stringify(result);
  }
  
  return result;
};


//
// CLASS PROPERTIES
//

/**
 * Builder.DefaultFilter(path) -> Boolean
 * - path (String): The path to be tested.
 *
 * Return `true` if the path should be included in the result.
**/
Builder.DefaultFilter = function(path) {
  return path
         && path.match(/\.(mustache|html|htm|tpl|js)$/i)
         && path.match(/\/(\.git|node_modules)\//) === null;
};

/**
 * namespace Builder.Processor
 *
 * A collection of async file processors. Result is passed to the callback.
**/
Builder.Processor = {
  text: function(path, cb) {
  }
};

/**
 * namespace Builder.SyncProcessor
 *
 * A collection of synchronous file processors. Result is returned from each function.
**/
Builder.SyncProcessor = {
  text: function(path) {
  }
};


//
// MODULE EXPORT
//

/**
 * fspkg(path, options, cb) -> undefined
 * - path (String): The root path of the package.
 * - options (Object): Options to use when processing the files in `path`.
 * - cb (Function(e, result)): Callback function which is given the result.
 *
 * Processes the file-system package at `path`.
**/
var fspkg = module.exports = function(path, options, cb) {
  var builder = new Builder(options);
  builder.build(path, cb);
}

fspkg.Builder = Builder;

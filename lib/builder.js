var fs = require('fs');
var path = require('path');
var util = require('util');
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
**/
function Builder(options) {
  options = options || {};
  options.filter = filter.Default;
  options.format = 'module';
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
	throw new Error('Not Implemented');
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
  text: function(path, cb) {
  	throw new Error('Not Implemented');
  }
};

//
// MODULE EXPORT
//

module.exports = Builder;

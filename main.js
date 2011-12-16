var fs = require('fs');
var path = require('path');
var util = require('util');
var Builder = require('./lib/builder');
var SyncBuilder = require('./lib/sync-builder');

//
// MODULE EXPORT
//

/**
 * fspkg(path, options, cb) -> undefined
 * - path (String): The root path of the package.
 * - options (Object): Options to use when processing the files in `path`.
 * - cb (Function(e, result)): Callback function which is given the result.
 *
 * NOT IMPLEMENTED. Processes the file-system package at `path`.
**/
var fspkg = module.exports = function(path, options, cb) {
  throw new Error('Not Implemented. Use `SyncBuilder` class for now.')
  // var builder = new Builder(options);
  // builder.build(path, cb);
}

fspkg.Builder = Builder;
fspkg.SyncBuilder = SyncBuilder;

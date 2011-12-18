var fs = require('fs');
var path = require('path');
var util = require('util');
var Filter = require('./lib/filter');
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
 * Processes the file-system package at `path`. This is the same as
 * instantiating a new `Builder`, then calling its `build` method.
**/
var fspkg = module.exports = function(path, options, cb) {
  if (!cb) {
    cb = options;
    options = undefined;
  }

  var builder = new Builder(options);
  builder.build(path, cb);
}

fspkg.Filter = Filter;
fspkg.Builder = Builder;
fspkg.SyncBuilder = SyncBuilder;

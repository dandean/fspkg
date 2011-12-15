var root = '';
var data = {};

var walk = function(directory, cb) {
  var parent = path.join(root, directory);
  fs.readdir(parent, function(e, result) {
    console.log(result);
    result.forEach(function(name) {
      var filePath = path.join(parent, name);
      fs.stat(filePath, function(e, x) {
        console.log(x)
      })
    });
  });
}

walk(__dirname);

// Usage:
var fspkg = require('fspkg');

var pkg;

// Minimal usage: processes all files in the path.
fspkg('./client', function(e, result) {
  pkg = result;
});

// Advanced usage:
// * filter with exclude and include regexes
// * file-type specific processors
// * catch-all processor
fspkg(
  './client',
  {
    filter: function(path) {
      return path.match(/\.(mustache|js|txt|png)$/);
    },
    '.txt': function(file, cb) {  },
    '.png': function(file, cb) {  },
    '.*': function(file, cb) { }
  },
  function(e, result) {
  }
);

var fspkger = new fspkg.Builder({
  format: 'json', // OR 'js'
  filter: function(path) {
    return path.match(/\.(mustache|js|txt|png)$/);
  },
  '.txt': function(file, cb) {  },
  '.png': function(file, cb) {  },
  '.*': function(file, cb) { }
});

fspkger.build('./client', function(e, result) {});
var pkg = fspkger.buildSync('./client');

// PROCESS:
// 1. collect a filtered array of all files
// 2. process each file using the extension's processor OR the catch-all

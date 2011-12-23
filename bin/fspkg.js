#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var program = require('commander');
var fspkg = require('../main');

// Read in the version of the program so that `fspkg -V` works.
var packagePath = path.join(__dirname, '..', 'package.json');
var packageContent = fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8');
var packageVersion = JSON.parse(packageContent).version;

// Tell the program what it's name is, for --help purposes.
program.name = 'fspkg';

program
  .version(packageVersion)
  .usage('[options] <source>')
  .option('-s, --save-path [savePath]', 'save path: prints to stdout if not given')
  .option(
    '-e, --extensions [extensions]',
    'file extensions to include in the package; default is "mustache,html,htm,txt"',
    function(list) {
      return list.split(',').map(function(ext) { return ext.trim(); })
    }
  )
  .parse(process.argv);

var source = program.args[0];
if (!source) {
  console.error('<source> source is required. See `fspkg --help`.');
  return;
}

// Figure out where to save this thing, if provided.
if (program.savePath) {
  savePath = program.savePath;
  if (savePath.match(/^\//)) {
    // relative to root
  } else if (savePath.match(/^\w/)) {
    // relative to cwd
    savePath = path.join(process.cwd(), savePath);
  } else if (savePath.match(/^(\.|\.\.)\//)) {
    // relative to cwd, starts with dots
    savePath = path.resolve(path.join(process.cwd(), savePath));
  }
  program.savePath = savePath;
}


var filter;

if (program.extensions) {
  // Create a filter based on the provided file extensions.
  filter = function(path) {
    var regex = new RegExp('\\w\\.(' + program.extensions.map(function(e) { return e.trim(); }).join('|') + ')$', "i");
    // path must be given...
    return path
      // include files of specified type
      && regex.test(path)
      // exclude anything in a .git or node_modules directory
      && path.match(/\/(\.git|node_modules)\//) === null;
  }
} else {
  // Extensions not given, use the default filter.
  filter = fspkg.Filter.Default;
}

// Create the filter based on the provided and default arguments.
var builder = new fspkg.SyncBuilder({
  filter: filter,
  '.png': fspkg.SyncBuilder.Processor.DataURI,
  '.jpg': fspkg.SyncBuilder.Processor.DataURI,
  '.gif': fspkg.SyncBuilder.Processor.DataURI
});

// Process the given source into a package.
var result = builder.build(source);

if (program.savePath) {
  // Save the result to a file.
  fs.writeFileSync(program.savePath, result);
  process.stdout.write('Package saved to `' + program.savePath + '`.');

} else {
  // Write the result to stdout for possible piping to other processes.
  process.stdout.write(result);
}
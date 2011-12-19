#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var program = require('commander');

var packagePath = path.join(__dirname, '..', 'package.json');
var packageContent = fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8');
var packageVersion = JSON.parse(packageContent).version;

program.name = 'fspkg';

program
  .version(packageVersion)
  .usage('[options] <directory>')
  .option(
    '-e, --extensions <extensions>',
    'File extensions to package [extensions]',
    function(list) {
      return list.split(',').map(function(ext) { return ext.trim(); })
    },
    ['mustache','txt','html','htm']
  )
  .option('-s, --save-path <save path>', 'Save path')
  .parse(process.argv);


// Figure out where to save this thing
if (!program.savePath) {
  program.savePath = program.args[0] + '.js';
}

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


// TODO: Create a new filter function, if extensions argument was passed.
// TODO: Create a new SyncBuilder and build the package.

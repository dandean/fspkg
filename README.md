[![build status](https://secure.travis-ci.org/dandean/fspkg.png)](http://travis-ci.org/dandean/fspkg)
fspkg: File System Packager
=============================

`fspkg` takes a directory or file as input and transforms it into a CommonJS module, JSON string or JavaScript object. `fspkg` is great for:

* bundling mustache templates for inclusion in a client-side application.
* encoding images and other assets as Data URIs.

For example, I use `fspkg` with <code>[modulr-node](https://github.com/tobie/modulr-node)</code> to compile my mustache templates for use in a [backbone.js](http://documentcloud.github.com/backbone/) application. This lets me do this within my backbone views (assuming I've packaged up my "views" directory:

```js
var MyView = Backbone.View.extend({
    ...
    render: function() {
      var template = require('views')['layouts/index.mustache'];
      var html = Mustache.to_html(template, this.model);
      this.el.html(html);
    },
    ...
});
```

Command-line API
----------------

```sh
Usage: fspkg [options] <source>

  Options:

    -h, --help                     output usage information
    -V, --version                  output the version number
    -s, --save-path [savePath]     save path: prints to stdout if not given
    -e, --extensions [extensions]  file extensions to include in the package; default is "mustache,html,htm,txt"
```


Node.js API
-----------

`fspkg` exposes both async and sync API's.

### Main Function ###

The module export is a shortcut to instantiating a new `Builder` and immediately
its `build` method, packaging the file-system at `path`.

```text
fspkg(path, [options,] cb)
- path (String): Path to the file to package.
- options (Object): Options to configure the builder.
- cb (Function(e, content)): Callback function which is given the file content.
```

#### Example ####

```js
require('fspkg')('./views', function(e, pkg) {
  console.log(pkg);
});
```

The above example would print a CommonJS module similar to this:

```js
module.exports = {
  "index.mustache": "<div>\n  Welcome {{username}}!\n</div> ...",
  "about/index.mustache": "<h1>This {{expletive}} is awesome</h1> ...",
  "about/contact.mustache": "<h1>Contact Us</h1>\n Phone: {{phone}}..."
  // etc...
}
```


### Builder (async) ###

```text
new Builder([options])
- options (Object): Options to configure the builder.

Creates a new Builder instance. Available Options:

  * filter (Function|String): A function or string which filters file paths
    found in the directory to be packaged.
    
    If a `String`, it should be a comma-separated list of file extensions,
    such as "foo,bar,baz". If a `Function`, should return `true` to include
    the file, `false` to exclude it.
    
    Defaults to "mustache,html,htm,txt".

  * format (String): The format to return from the `build` method:
    "module", "json" or "object". Defaults to "module";



Builder#build(path, cb)
- path (String): The root path of the package.
- cb (Function(e, result)): Callback function which is given the result.

Builds the directory or file `path`. `result` is a package in the configured format.



Builder.Processor.*(path, cb) -> String
- path (String): Path to the file to package.
- cb (Function(e, content)): Callback function which is given the file content.

All processors have the same signature: they take a file path and callback function.
The file content is encoded file as a String and passed to `cb` as the 2nd argument.

Builder.Processor.Default(path, cb)
Builder.Processor.Base64(path, cb)
Builder.Processor.DataURI(path, cb)
```


### SyncBuilder ###

```text
new SyncBuilder([options])
- options (Object): Options to configure the builder.

Creates a new SyncBuilder instance. Available Options:

  * filter (Function|String): A function or string which filters file paths
    found in the directory to be packaged.
    
    If a `String`, it should be a comma-separated list of file extensions,
    such as "foo,bar,baz". If a `Function`, should return `true` to include
    the file, `false` to exclude it.
    
    Defaults to "mustache,html,htm,txt".

  * format (String): The format to return from the `build` method:
    "module", "json" or "object". Defaults to "module";



SyncBuilder#build(path) -> ?
- path (String): The root path of the package.

Builds the directory or file `path`, returning a package in the configured format.



SyncBuilder.Processor.*(path) -> String
- path (String): Path to the file to package.

All processors have the same signature: they take a file path and return the
encoded file as a String.

SyncBuilder.Processor.Default(path) -> UTF-8 encoded string.
SyncBuilder.Processor.Base64(path) -> Base64 encoded string.
SyncBuilder.Processor.DataURI(path) -> Base64 encoded Data URI.
```

### Filter ###

```text
Filter.Default(path) -> Boolean
- path (String): The path to the file.

Returns `true` if the file should be included in the package, otherwise: `false`.
Only .mustache, .html, .htm and .txt files pass this filter, and all files within
".git" and "node_modules" direcotories are excluded.
```


Example
-------

```js
var fs = require('fs');
var fspkg = require('fspkg');

var builder = new fspkg.SyncBuilder({
  filter: function(path) {
    // Include .png files...
    if (path && path.match(/\.png$/)) return true;
    return fspkg.Filter.Default(path);
  },
      
  // Use the Data URI processor for .png files
  '.png': function(path) {
    return fspkg.SyncBuilder.Processor.DataURI(path);
  }
});

// Assuming you have a "stuff" directory with PNGs and other
// files that you want to package up:
var result = builder.build('./stuff');

// Write the module to the current directory as "assets.js".
fs.writeFileSync('./assets.js', result);

// Now you can require() the file and use it for whatever.
console.log(require('./assets.js'));
```


Install
-------

`npm install fspkg`

To install the command-line utility, add the `-g` flag during installation.



License
-------

MIT
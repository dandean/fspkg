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


API
---

`fspkg` exposes both sync and async API's. The async API is still in progess, so only the sync is currently documented.

### SyncBuilder ###

```text
new SyncBuilder([options])
- options (Object): Options to configure the builder.

Creates a new SyncBuilder instance. Available Options:

  * filter (Function(String path)): A function which filters file paths found in the
      directory to be packaged. Should return `true` to include the file, `false` to
      exclude it. Defaults to `fspkg.Filter.Default` when `filter` option is not
      provided.

  * format (String): The format to return from the `build` method:
      "module", "json" or "object". Defaults to "module";



SyncBuilder#build(path) -> ?
- path (String): The root path of the package.

Build the directory or file `path`, returning a package in the configured format.



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


TODO
----

Async Builder and root module function.


License
-------

MIT
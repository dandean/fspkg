var fs = require('fs');
var path = require('path');
var fspkg = require('../main');
var assert = require('assert');

describe('Module', function(){
  var gitDirNormal = path.join(__dirname, 'scaffold', 'git');
  var gitDirTesting = path.join(__dirname, 'scaffold', '.git');

  // Cannot include ".git" directories in a git repositories. Move our scaffold "git"
  // directory to ".git" before running tests.
  try {
    fs.renameSync(gitDirNormal, gitDirTesting);
  } catch (e) {
    console.warn(e.message);
  }

  after(function() {
    try {
      fs.renameSync(gitDirTesting, gitDirNormal);
    } catch (e) {
      console.warn(e.message);
    }
  });

  it('should be a function', function(){
    assert.ok(fspkg instanceof Function);
  });

  describe('exported function', function() {
    var result;

    before(function(done) {
      fspkg('./test/scaffold', function(e, pkg) {
        result = pkg;
        done();
      });
    });

    it('should return a CommonJS module by default', function(){
      assert.ok(result.indexOf('module.exports = {') === 0);
    });

    it('should have a `Builder` property which is a function', function(){
      assert.ok(fspkg.Builder instanceof Function);
    });

    it('should have a `SyncBuilder` property which is a function', function(){
      assert.ok(fspkg.SyncBuilder instanceof Function);
    });

    it('should have a `Filter` property', function(){
      assert.ok('Filter' in fspkg);
    });
  });

  describe('Builder', function() {
    var pkgr = new fspkg.Builder({ format: 'object' });
    var result;

    before(function(done) {
      pkgr.build('./test/scaffold', function(e, pkg) {
        result = pkg;
        done();
      });
    });

    it('should include "html", "htm", "mustache" and "txt" files by default', function() {
      // console.log(result, Object.keys(result), Object.keys(result).length);
      var count = Object.keys(result).length;
      assert.equal(5, count, 'Should have found 5 files but found ' + count);
      assert.ok('index.htm' in result);
      assert.ok('index.html' in result);
      assert.ok('index.mustache' in result);
      assert.ok('index.txt' in result);
      assert.ok('sub/index.html' in result);
    });

    it('should not include contents of ".git" or "node_modules" directories by default', function() {
      var keys = Object.keys(result);
      assert.ok(keys.indexOf('sub/index.html') > -1, 'could not find key for file in sub-directory: "sub/index.html"');
      assert.ok(keys.indexOf('.git/index.html') === -1);
      assert.ok(keys.indexOf('node_modules/index.html') === -1);
    });

    describe('with file-type processors and custom filter', function() {

      var pkgr = new fspkg.Builder({
        format: 'object',

        filter: function(path) {
          // Include .png files...
          if (path && path.match(/\.png$/)) return true;
          return fspkg.Filter.Default(path);
        },

        // Custom .txt processor
        '.txt': function(path, cb) {
          cb(null, 'TEXT FILE');
        },

        // Custom .png processor
        '.png': function(path, cb) {
          fspkg.Builder.Processor.DataURI(path, cb);
        },

        // Custom .html processor
        '.html': fspkg.Builder.Processor.DataURI
      });

      var result;
    
      before(function(done) {
        pkgr.build('./test/scaffold', function(e, pkg) {
          result = pkg;
          done();
        });
      });

      it('should use extension-specific processors when present in `options` argument', function() {
        assert.equal('TEXT FILE', result['index.txt'], 'Custom .txt processor did not execute.');
        assert.ok(result['index.html'].indexOf('data:text/html;charset=UTF-8;base64,') === 0, 'Custom .html processor did not return Data URI of file contents.');
      });

      it('should include .png files, encoded as Data URIs', function() {
        assert.ok('img/cat-videos.png' in result, 'PNG was not found in object.');
        assert.ok(result['img/cat-videos.png'].indexOf('data:image/png;base64,') === 0, 'PNG was not encoded as a Data URI.');
      });

    });

  });

  describe('SyncBuilder', function() {
    var pkgr1 = new fspkg.SyncBuilder({ format: 'object' });
    var result1 = pkgr1.build('./test/scaffold');

    it('should include "html", "htm", "mustache" and "txt" files by default', function() {
      var count = Object.keys(result1).length;
      assert.equal(5, count, 'Should have found 5 files but found ' + count);
      assert.ok('index.htm' in result1);
      assert.ok('index.html' in result1);
      assert.ok('index.mustache' in result1);
      assert.ok('index.txt' in result1);
      assert.ok('sub/index.html' in result1);
    });

    it('should not include contents of ".git" or "node_modules" directories by default', function() {
      var keys = Object.keys(result1);
      assert.ok(keys.indexOf('sub/index.html') > -1, 'could not find key for file in sub-directory: "sub/index.html"');
      assert.ok(keys.indexOf('.git/index.html') === -1);
      assert.ok(keys.indexOf('node_modules/index.html') === -1);
    });

    var pkgr2 = new fspkg.SyncBuilder({
      format: 'object',
      
      filter: function(path) {
        // Include .png files...
        if (path && path.match(/\.png$/)) return true;
        return fspkg.Filter.Default(path);
      },

      // Custom .txt processor
      '.txt': function(path) {
        return 'TEXT FILE';
      },

      // Custom .png processor
      '.png': function(path) {
        return fspkg.SyncBuilder.Processor.DataURI(path);
      },

      // Custom .html processor
      '.html': fspkg.SyncBuilder.Processor.DataURI
    });

    var result2 = pkgr2.build('./test/scaffold');

    it('should use extension-specific processors when present in `options` argument', function() {
      assert.equal('TEXT FILE', result2['index.txt'], 'Custom .txt processor did not execute.');
      assert.ok(result2['index.html'].indexOf('data:text/html;charset=UTF-8;base64,') === 0, 'Custom .html processor did not return Data URI of file contents.');
    });

    it('should include .png files, encoded as Data URIs', function() {
      assert.ok('img/cat-videos.png' in result2, 'PNG was not found in object.');
      assert.ok(result2['img/cat-videos.png'].indexOf('data:image/png;base64,') === 0, 'PNG was not encoded as a Data URI.');
    });
  });
});

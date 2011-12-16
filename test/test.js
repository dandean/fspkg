var fspkg = require('../main');
var assert = require('assert');

describe('Module', function(){
  it('should be a function', function(){
    assert.ok(fspkg instanceof Function);
  });
  
  it('should should have a `Builder` property which is a function', function(){
    assert.ok(fspkg.SyncBuilder instanceof Function);
  });
  
  var pkgr = new fspkg.SyncBuilder();
  var result = pkgr.build('./');
  
  // console.log(result);
  
  // require('fs').writeFileSync('./test2.js', result);
  // console.log(require('../test2.js')['main.js']);
  
  // console.log(result);
});

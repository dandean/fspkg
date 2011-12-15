var fspkg = require('../main');
var assert = require('assert');

describe('Module', function(){
  it('should be a function', function(){
    assert.ok(fspkg instanceof Function);
  });
  
  it('should should have a `Builder` property which is a function', function(){
    assert.ok(fspkg.Builder instanceof Function);
  });
  
  var pkgr = new fspkg.Builder();
  var result = pkgr.buildSync('./');

  // require('fs').writeFileSync('./test2.js', result);
  // console.log(require('../test2.js')['main.js']);
  
  // console.log(result);
   
  // it('should retain a reference to the raw input', function() {
  //   assert.ok(Object.prototype.toString.call(result.rawInput) === '[object String]');
  // });
  // 
  // it('should convert integer-like values to a Number', function() {
  //   // Zero
  //   assert.ok(Object.prototype.toString.call(result['Channel statistics'].Alpha.skewness) === '[object Number]');
  // 
  //   // Negative
  //   assert.ok(Object.prototype.toString.call(result['Channel statistics'].Alpha.kurtosis) === '[object Number]');
  // });
  // 
  // it('should convert float-like values to a Number', function() {
  //   // Zero
  //   assert.ok(Object.prototype.toString.call(result['Channel statistics'].Blue.skewness) === '[object Number]');
  // 
  //   // Negative
  //   assert.ok(Object.prototype.toString.call(result['Channel statistics'].Blue.kurtosis) === '[object Number]');
  // });
  // 
  // it('should convert property names to camelCase when specified', function() {
  //   assert.ok(Object.keys(result).indexOf('Image statistics') > -1);
  //   result = reader(input, true);
  //   assert.ok(Object.keys(result).indexOf('imageStatistics') > -1);
  // });
  // 
  // it('should extract `width` and `height` properties from `geometry` property', function() {
  //   assert.ok(Object.keys(result).indexOf('width') > -1);
  //   assert.ok(Object.keys(result).indexOf('height') > -1);
  // });
});

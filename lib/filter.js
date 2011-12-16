/**
 * namespace Filter
**/
var Filter = module.exports = {
  /**
   * Filter.Default(path) -> Boolean
   * - path (String): The path to be tested.
   *
   * Return `true` if the path should be included in the result.
  **/
  Default: function(path) {
    return path
      && path.match(/\.(mustache|html|htm|tpl|js)$/i)
      && path.match(/\/(\.git|node_modules)\//) === null;
  }
};

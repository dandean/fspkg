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
    // path must be given...
    return path
      // include files of type mustache, html, htm, txt
      && path.match(/\w\.(mustache|html|htm|txt)$/i)
      // exclude anything in a .git or node_modules directory
      && path.match(/\/(\.git|node_modules)\//) === null;
  }
};

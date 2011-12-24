var createExtensionFilter = function(extensions) {
  extensions = extensions.replace(/ ?, ?/g, '|');
  var regex = new RegExp('\\w\\.(' + extensions + ')$', "i");

  return function(path) {
    return path
      // include files of specified type
      && regex.test(path)
      // exclude anything in a .git or node_modules directory
      && path.match(/\/(\.git|node_modules)\//) === null;
  };
};

/**
 * namespace Filter
**/
var Filter = module.exports = {
  /**
   * Filter.createExtensionFilter(extensions) -> Function
   * - extensions (String): Comma-separated list of file extensions
   *
   * Returns a function which filters paths by file extensions
  **/
  createExtensionFilter: createExtensionFilter,

  /**
   * Filter.Default(path) -> Boolean
   * - path (String): The path to be tested.
   *
   * Return `true` if the path should be included in the result.
  **/
  Default: createExtensionFilter('mustache,html,htm,txt')
};


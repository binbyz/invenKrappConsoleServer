const tfs = require('tail-stream');

/**
 * tailStreamWrapper
 * @param {String} path 
 * @param {String} namespace 
 * @param {String} category 
 * @param {Integer} interval 
 */
function tailStreamWrapper(path, namespace = '', category = '', interval = 100) {
  let t;

  if (!path) throw new Error("input path");
  t = tfs.createReadStream(path, { interval: interval });

  if (namespace) {
    t._namespace = namespace;
  }

  if (category) {
    t._category = category;
  }

  return t;
}

module.exports = tailStreamWrapper;
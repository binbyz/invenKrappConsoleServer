const fs = require('fs');
const tfs = require('tail-stream');

/**
 * tailStreamWrapper
 * @param {String} namespace 
 * @param {String} path 
 * @param {Integer} interval 
 */
function tailStreamWrapper(namespace = '', path, interval = 100) {
  let t;

  if (!path) {
    throw new Error("input path");
  }

  if (!fs.existsSync(path)) {
    throw new Error("file not exists!");
  }

  t = tfs.createReadStream(path, { interval: interval });
  namespace = namespace.trim();

  if (namespace) {
    t.namespace = namespace;
  }

  t.pipe = (o) => {
    if (o) {
      t.on('data', o._read);
    }
  }

  return t;
}

module.exports = tailStreamWrapper;
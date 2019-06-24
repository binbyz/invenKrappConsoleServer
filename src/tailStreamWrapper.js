const fs      = require('fs');
const tfs     = require('tail-stream');
const encrpyt = require('./Encrypt');

/**
 * tailStreamWrapper
 * @param {String} namespace 
 * @param {String} path 
 * @param {Integer} interval 
 */
function tailStreamWrapper(namespace = '', path, interval = 100) {
  let stream;

  if (!path) {
    throw new Error("input path");
  }

  if (!fs.existsSync(path)) {
    throw new Error("file not exists!");
  }

  stream = tfs.createReadStream(path, { interval: interval });
  namespace = namespace.trim();

  if (namespace) {
    stream.namespace = namespace;
  }

  stream.pipe = (socketContainer) => {
    if (socketContainer) {
      stream.on('data', socketContainer._read);
      stream.on('data', (chunk) => {
        let objChunk = encrpyt(JSON.stringify({
          namespace: stream.namespace,
          chunk    : chunk.toString()
        }));

        socketContainer._read(objChunk);
      });
    }
  };

  return stream;
}

module.exports = tailStreamWrapper;
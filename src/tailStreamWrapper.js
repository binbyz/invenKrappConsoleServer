const fs = require('fs');
const tfs = require('tail-stream');
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

  console.log('stream.namespace', stream.namespace);

  stream.pipe = (o) => {
    if (o) {
      stream.on('data', o._read); // =socketContainer._read
      stream.on('data', (chunk) => {
        let objChunk = encrpyt(JSON.stringify({
          namespace: encrpyt(stream.namespace),
          chunk    : encrpyt(chunk.toString())
        }));

        o._read(objChunk);
      });
    }
  };

  return stream;
}

module.exports = tailStreamWrapper;
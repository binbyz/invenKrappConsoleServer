const sh = require('shelljs');
const Enctpyt = require('./Encrypt');

/**
 * commandParser
 */
function commandParser() {
  const __fParser = (cmd) => {
    console.dir(cmd);
    // console.log(cmd.toSource());
    // console.log(JSON.stringify(cmd));

    // if (!(typeof cmd === 'object' && 'namespace' in cmd)) {
    //   return;
    // }

    // let namespace = cmd.namespace.trim().split('.').map(v => !!v.length);
    // console.log(namespace);
  }

  return {
    parse: __fParser
  }
}

module.exports = commandParser;
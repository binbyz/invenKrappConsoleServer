const sh = require('shelljs');

/**
 * commandParser
 */
function commandParser() {
  const parse = (cmd) => {
    if (!(typeof cmd === 'object' && 'namespace' in cmd)) {
      return;
    }

    let namespace = cmd.namespace.trim().split('.').map(v => !!v.length);
    console.log(namespace);
  }
}

module.exports = commandParser;
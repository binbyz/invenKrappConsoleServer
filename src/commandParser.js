const util     = require('util')
const bash     = util.promisify(require('child_process').exec)
const atob     = require('atob')
const exec     = require('./exec')
const spiltter = /(?:\$\$)/ig

const __options = {
  "encoding": "utf8",
  "shell"   : "/bin/bash"
}

/**
 * commandParser
 */
function commandParser() {
  /**
   * 명령어가 들어오면 처리 함
   * @param Object rawMessage 
   */
  const __fParser = (rawMessage, callback) => {
    console.log('rawMessage', rawMessage)
    let argv = atob(atob(rawMessage, callback)).split(spiltter)
    let systemCommand = ''

    if (argv.length === 3) {
      argv = JSON.parse(argv[1])

      if (typeof argv === 'object' &&  'type' in argv && 'command' in argv) {
        systemCommand = exec.get(argv.command)

        try {
          (async () => {
              if (systemCommand.length) {
                const { stdout, stderr } = await bash(systemCommand, __options)

                let chunk = {
                  namespace: argv.namespace,
                  command  : argv.command,
                  stdout   : encodeURIComponent(stdout.trim()),
                  stderr   : encodeURIComponent(stderr.trim())
                }

                if (typeof callback === 'function') {
                  callback(chunk)
                }
              }
          })() 
        } catch (e) {
          console.trace(e)
        }       
      }
    } else {
      console.trace(` 실행할 수 없는 명령어 입니다.`, argv)
    } 
  }

  // public
  return {
    parse: __fParser
  }
}

module.exports = commandParser
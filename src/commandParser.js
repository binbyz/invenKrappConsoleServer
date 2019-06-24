const util     = require('util')
const bash     = util.promisify(require('child_process').exec)
const atob     = require('atob')
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
    let argv = atob(atob(rawMessage, callback)).split(spiltter)
    let systemCommand = ''

    if (argv.length === 3) {
      argv = JSON.parse(argv[1])

      if (typeof argv === 'object' &&  'type' in argv && 'command' in argv) {
        argv.command = argv.command.trim().toLowerCase()

        // TODO: alias로 된 단축어는 인식이 안되는데, 통일되게 관리 할 수 있는 방법이 있을까..
        switch (argv.command) {
          case 'reloadall':
            systemCommand = `sudo /etc/init.d/php7.0-fpm reload | sudo /etc/init.d/nginx reload`
            break
          case 'isync':
            systemCommand = `sudo sh /etc/inven/sync_settings.sh`
            break;
          case 'profileoff':
          case 'profileon':
            let onoff = (argv.command.replace('profile', '').trim().toLowerCase()) === 'on' ? '1' : '0'
            systemCommand = `sed -i 's,^xdebug.profiler_enable =.*$,xdebug.profiler_enable = ${onoff},' /etc/php/7.0/fpm/conf.d/20-xdebug.ini | reloadall`
            break;
          default:
        }

        (async () => {
          try {
            if (systemCommand.length) {
              const { stdout, stderr } = await bash(systemCommand, __options)

              let chunk = {
                namespace: argv.namespace,
                command  : argv.command,
                stdout   : stdout,
                stderr   : stderr
              }

              if (typeof callback === 'function') {
                callback(chunk)
              }
            }
          } catch (e) {}
        })()        
      }
    } else {
      console.log(` 실행할 수 없는 명령어 입니다.`, argv)
    } 
  }

  // public
  return {
    parse: __fParser
  }
}

module.exports = commandParser
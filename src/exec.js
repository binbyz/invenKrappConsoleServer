module.exports = class {
  /**
   * Return command line
   * 
   * @param {String} command 
   * @param {Object} extData
   */
  static get(command, extra = null) {
    let commands = command.trim().toLowerCase().split('@')
    const moment = require('moment')

    switch (commands[0]) {
      case 'reloadall':
        return `sudo /etc/init.d/php7.0-fpm reload | sudo /etc/init.d/nginx reload`
      case 'isync':
        return `sudo sh /etc/inven/sync_settings.sh`
      case 'profileon':
      case 'profileoff':
        let onoff = (commands[0].replace('profile', '').trim().toLowerCase()) === 'on' ? '1' : '0'
        return `sed -i 's,^xdebug.profiler_enable =.*$,xdebug.profiler_enable = ${onoff},' /etc/php/7.0/fpm/conf.d/20-xdebug.ini | ${this.get('reloadall')}`
      case 'dotenv':
        if (commands.length === 2) {
          commands[1] = String(commands[1]).trim().toLowerCase()

          if (commands[1] === 'write') {
            if (extra !== null && typeof extra === 'object' && 'editorValue' in extra) {
              extra.editorValue = decodeURIComponent(extra.editorValue)
              extra.editorValue = extra.editorValue.replace(/\n?#\s(?:last-modified\:\s[\-\d\s\:]+|created by iConsole)/ig, '')

              return `sudo cp /usr/home/simsung/.env /usr/home/simsung/.env_ | sudo tee /usr/home/simsung/.env <<EOF
${extra.editorValue}

# last-modified: ${moment().format('YYYY-MM-DD HH:mm:ss')}
# created by iConsole
EOF`
            }

            return ''
          } else {
            // read
            return `cat /usr/home/simsung/.env`
          }
        }
        break;
    }
  }
}
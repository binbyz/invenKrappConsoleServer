module.exports = class {
  /**
   * Return command line
   * 
   * @param {String} command 
   */
  static get(command) {
    let commands = command.trim().toLowerCase().split('@')

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

          } else {
            // read
            return `cat /usr/home/simsung/.env`
          }
        }
        break;
    }
  }
}
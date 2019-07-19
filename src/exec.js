module.exports = class {
  /**
   * Return command line
   * 
   * @param {String} command 
   */
  static get(command) {
    command = command.trim().toLowerCase()

    switch (command) {
      case 'reloadall':
        return `sudo /etc/init.d/php7.0-fpm reload | sudo /etc/init.d/nginx reload`
      case 'isync':
        return `sudo sh /etc/inven/sync_settings.sh`
      case 'profileon':
      case 'profileoff':
        let onoff = (command.replace('profile', '').trim().toLowerCase()) === 'on' ? '1' : '0'
        return `sed -i 's,^xdebug.profiler_enable =.*$,xdebug.profiler_enable = ${onoff},' /etc/php/7.0/fpm/conf.d/20-xdebug.ini | ${this.get('reloadall')}`
    }
  }
}
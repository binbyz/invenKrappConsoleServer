const btoa = require('btoa');

module.exports = function (str) {
  return btoa(btoa(str));
};
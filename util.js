module.exports = {
  macb64: function(mac) {
    return new Buffer(mac.replace(':', ''), 'hex').toString('base64');
  },
  b64mac: function(mac) {
    return new Buffer(b64, 'base64').toString('hex').split(2).join(':');
  }
};

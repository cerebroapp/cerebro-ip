const { memoize } = require('cerebro-tools')
const os = require('os')
const icon = require('./icon.png')
const LOCAL_IP_CMD = 'ipconfig getifaddr en0'

const MEMOIZE_OPTIONS = {
  length: false,
  promise: 'then',
  maxAge: 60 * 1000 // IP cache expires in 1 min
}

const getExternalIp = memoize(() => (
  fetch('https://ifconfig.co/ip').then(response => response.text())
), MEMOIZE_OPTIONS)

const getLocalIp = memoize(() => {
  const ifaces = os.networkInterfaces();
  const value = Object
    .keys(ifaces)
    .map(name => ifaces[name])
    .reduce((acc, arr) => [...acc, ...arr], [])
    .find(({family, internal}) => family === 'IPv4' && !internal) || {}
  const ip = value.address || '0.0.0.0'
  return Promise.resolve(ip)
}, MEMOIZE_OPTIONS)

const commands = {
  'Local IP': getLocalIp,
  'External IP': getExternalIp
}

/**
 * Plugin to look and display local and external IPs
 *
 * @param  {String} options.term
 * @param  {Function} options.display
 */
const fn = ({term, display, actions}) => {
  if (term.match(/^ip\s?$/i)) {
    Object.keys(commands).forEach(key => {
      commands[key]().then(ip => {
        display({
          icon,
          title: `${key}: ${ip}`,
          clipboard: ip,
          getPreview: () => `<div style="font-size: 2em;">${ip}</div>`,
          onSelect: () => actions.copyToClipboard(ip),
        });
      })
    })
  }
};

module.exports = {
  name: 'Show your IP',
  keyword: 'ip',
  fn,
  icon
};

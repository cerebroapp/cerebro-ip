const { shellCommand } = require('cerebro-tools');
const icon = require('./icon.png');

const LOCAL_IP_CMD = 'ipconfig getifaddr en0';
const EXTERNAL_IP_CMD = 'curl --silent http://icanhazip.com';

/**
 * Plugin to look and display local and external IPs
 *
 * @param  {String} options.term
 * @param  {Function} options.display
 */
const fn = ({term, display, actions}) => {
  if (term.match(/^ip\s?$/i)) {
    shellCommand(LOCAL_IP_CMD).then(local => {
      display({
        icon,
        title: `Local IP: ${local}`,
        clipboard: local,
        getPreview: () => `<div style="font-size: 2em;">${local}</div>`,
        onSelect: () => actions.copyToClipboard(local),
      });
    });
    shellCommand(EXTERNAL_IP_CMD).then(external => {
      display({
        icon,
        title: `External IP: ${external}`,
        clipboard: external,
        getPreview: () => `<div style="font-size: 2em;">${external}</div>`,
        onSelect: () => actions.copyToClipboard(external),
      });
    });
  }
};

module.exports = {
  name: 'Show your IP',
  keyword: 'ip',
  fn,
  icon
};

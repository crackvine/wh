const chalk = require('chalk');

const tstamp = new Date().toISOString();

module.exports = (config) => ({
  info: (message) => console.log(tstamp, chalk.blue(message)),
  debug: (message) => (config.DEBUG ? console.debug(tstamp, chalk.gray(JSON.stringify(message, null, 2))) : null),
  error: (message) => console.error(tstamp, chalk.red(message)),
});

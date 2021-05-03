const chalk = require('chalk');

module.exports = (config) => ({
  info: (message) => console.log(new Date().toISOString(), chalk.blue(message)),
  debug: (message) => (config.DEBUG
    ? console.debug(new Date().toISOString(), chalk.gray(JSON.stringify(message, null, 2)))
    : null),
  error: (message) => console.error(new Date().toISOString(), chalk.red(message)),
});

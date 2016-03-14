'use strict'
var bunyan = require('bunyan')

var log = bunyan.createLogger({
  name: process.env.LOGGER_NAME || 'git-spy',
  level: process.env.LOGGER_LEVEL || 'info'
})

module.exports = {
  trace: log.trace.bind(log),
  debug: log.debug.bind(log),
  info: log.info.bind(log),
  warn: log.warn.bind(log),
  error: log.error.bind(log),
  fatal: log.fatal.bind(log)
}

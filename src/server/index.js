'use strict'

var log = require('../utils/logger')
var restify = require('restify')
var parseFromGithub = require('../hookshot-manager').parseFromGithub
var theServer

var Server = module.exports = {
  running: false,
  start: function connect (config) {
    Server.port = config.port
    return new Promise(function (resolve, reject) {
      theServer.listen(config.port, function () {
        log.info('server listening on port %s', config.port)
        Server.running = true
        resolve()
      })
    })
  },
  stop: function () {
    Server.running = false
    theServer.close()
    return Promise.resolve()
  }
}

theServer = restify.createServer({
  name: 'git-spy',
  version: '1.0.0'
})

theServer.use(restify.CORS())
theServer.use(restify.fullResponse())

var currentCommit = null

theServer.post('/push', function (req, res) {
  var spy = require('../spy')
  var hookshotData
  parseFromGithub(req)
    .then(function (hookData) {
      hookshotData = hookData
      res.status(202)
      res.end('ACCEPTED')
      return hookData
    })
    .then(function (hookData) {
      return spy.match(hookData)
    })
    .then(function (res) {
      var after = hookshotData.after
      if (currentCommit === after) {
        log.debug('currentCommit === after')
        return
      }
      currentCommit = after
      return spy.executeCallbacks(res.callbacks, hookshotData, res.diffs)
        .then(function assignCurrentCommit () {
          currentCommit = null
        })
    })
    .catch(function (err) {
      log.error({err: err}, 'error parsing from github')
    })
})

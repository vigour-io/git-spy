'use strict'

var restify = require('restify')
var parseFromGithub = require('../hookshot-manager').parseFromGithub
var theServer

var Server = module.exports = {
  running: false,
  start: function connect (config) {
    Server.port = config.port
    return new Promise(function (fulfill, reject) {
      theServer.listen(config.port, function () {
        Server.running = true
        fulfill()
      })
    })
  },
  stop: function () {
    Server.running = false
    theServer.close()
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
        return
      }
      currentCommit = after
      return spy.executeCallbacks(res.callbacks, hookshotData, res.diffs)
        .then(() => currentCommit = null)
    })
    .catch(function (err) {
      console.log('err', err.stack)
    })
})


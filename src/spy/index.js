'use strict'

var log = require('../utils/logger')
var githubApi = require('../github-api')
var matchSubscriptions = require('./match-subscriptions')
var subscriptions = []
var config

var spy = module.exports = {
  server: require('../server'),
  subscriptions: subscriptions,
  init: function (cfg) {
    config = cfg
    return githubApi.init(config)
      .then(() => {
        return this.server.start(config)
      })
  },
  stop: function () {
    return this.server.stop()
  },
  match: function (hookshotData) {
    return Promise.resolve({
      callbacks: matchSubscriptions(hookshotData)
    })
  },

  on: function (pattern, callback) {
    pattern.callback = callback
    subscriptions.push(pattern)
  },

  clearSubscriptions: function () {
    spy.subscriptions.splice(0, spy.subscriptions.length)
  },

  executeCallbacks: function (callbacks, hookshotData, diffs) {
    var l = callbacks.length
    if (config && config.verbose && l > 0) {
      log.info('executing callbacks')
    }
    for (var i = 0; i < l; i++) {
      callbacks[i](hookshotData, diffs)
    }
    return Promise.resolve()
  }
}

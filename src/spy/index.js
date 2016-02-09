'use strict'

var log = require('npmlog')
var githubApi = require('../github-api')
var matchSubscriptions = require('./match-subscriptions')
// var fetchDiffs = require('./fetch-diffs')
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
    // var diffs
    // return fetchDiffs(hookshotData)
    //   .then(function (ds) {
    //     console.log('\n\nDIFFS\n', ds)
    //     diffs = ds
    //   })
    //   .then(function () {
    //     return matchSubscriptions(hookshotData, diffs)
    //   })
    //   .then(function (callbacks) {
    //     var res = {
    //       callbacks: callbacks,
    //       diffs: diffs
    //     }
    //     return res
    //   })
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
      log.info('git-spy', 'executing callbacks')
    }
    for (var i = 0; i < l; i++) {
      callbacks[i](hookshotData, diffs)
    }
    return Promise.resolve()
  }
}

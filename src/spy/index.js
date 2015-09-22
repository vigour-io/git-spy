var server = require('../server')
var githubApi = require('../github-api')
var matchSubscriptions = require('./match-subscriptions')
var fetchDiffs = require('./fetch-diffs')
var subscriptions = []

var spy = module.exports = {
  subscriptions: subscriptions,
  connect: function (config) {
    githubApi.authenticate(config)
    return githubApi.init()
      .then(function (res) {
        res = JSON.parse(res)
        if (!res.login) {
          throw Error('not connected')
        }
      })
      .then(function () {
        return server.start(config)
      })
  },
  match: function (hookshotData) {
    var diffs
    return fetchDiffs(hookshotData)
      .then(function (ds) {
        diffs = ds
      })
      .then(function () {
        return matchSubscriptions(hookshotData, diffs)
      })
      .then(function (callbacks) {
        var res = {
          callbacks: callbacks,
          diffs: diffs
        }
        return res
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
    for (var i = 0, l = callbacks.length; i < l; i++) {
      callbacks[i](hookshotData, diffs)
    }
  }
}

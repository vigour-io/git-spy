var https = require('https')
var _ = require('lodash')
var defaultPayload = {
  hostname: 'api.github.com',
  method: 'GET',
  path: undefined,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': 'token ',
    'User-Agent': 'vigour-git-spy'
    }
}

var config

var githubApi = module.exports = {
  authenticated: false,
  token: undefined,
  initialized: false,
  createHook: createHook,
  getHooks: getHooks,
  fetchFile: fetchFile,
  init: function (cfg) {
    config = cfg
    defaultPayload.headers['Authorization'] += config.apiToken

    console.log(config)
    return new Promise(function (fulfill, reject) {
      getHooks(function (hooks) {
        var pushHook = _.find(hooks, function (hook) {
          return hook.config === config.hooks.callbackUrl + '/push'
        })

        if (!pushHook) {
          createHook({ event: 'push' }, fulfill, reject)
        }
      }, reject)
    })
  }
}

function getHooks (callback, errCallback) {
  var payload = _.merge(defaultPayload, {
    path: '/orgs/' + config.organization.login
  })
  return sendRequest(payload, {}, getChunksParser(callback), errCallback)
}

function createHook (data, callback, errCallback) {
  var payload = _.merge(defaultPayload, {
    method: 'POST',
    path: '/orgs/' + config.organization.login
  })
  return sendRequest(payload, {
    name: 'web',
    config: {
      url: config.hooks.callbackUrl + '/' + data.event,
      content_type: 'json'
    },
    events: [data.event],
    active: false
  }, getChunksParser(callback), errCallback)
}

function fetchFile (data, callback, errCallback) {
  var payload = _.merge(defaultPayload, {
    path: '/repos/' + data.owner + '/' + data.repo 
      + '/contents/' + data.path + '?ref=' + data.sha
  })
  return sendRequest(payload, {}, getChunksParser(callback), errCallback)
}

function getChunksParser (callback) {
  return function (resp) {
    var total = ''
    resp.on('data', function (chunk) {
      total += chunk
    })
    resp.on('end', function () {
      callback(total)
    })
  }
}

function sendRequest (config, data, callback, errCallback) {
  var req = https.request(config, callback)
  req.on('error', function (err) {
    errCallback.apply(req, arguments)
  })
  if (data) req.write(JSON.stringify(data))
  req.end()
}




var https = require('https')
var _ = require('lodash')
var axios = require('axios')

var hostName = 'api.github.com'
var defaultPayload = {
  hostname: hostName,
  method: 'GET',
  path: undefined,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': 'token ',
    'User-Agent': 'vigour-git-spy'
  }
}

var config

module.exports = {
  authenticated: false,
  token: undefined,
  initialized: false,
  createHook: createHook,
  getHooks: getHooks,
  fetchFile: fetchFile,
  init: function (cfg) {
    config = cfg
    defaultPayload.headers['Authorization'] += config.apiToken
    return checkForWebhook()
      .then(confusingInit)
  }
}

function checkForWebhook () {
  var url = `https://${hostName}/orgs/${config.owner}/hooks`
  var payload = {
    method: 'GET',
    url: url,
    headers: defaultPayload.headers
  }
  return axios(payload)
    .then((res) => res.data)
    .then((hooks) => hooks.filter((hook) => hook.config.url === config.callbackURL).length)
    .then((exists) => !exists && createWebHook())
}

var createWebHook = function () {
  console.log('creating web hook')
  var url = `https://${hostName}/orgs/${config.owner}/hooks`
  var payload = {
    method: 'POST',
    url: url,
    headers: defaultPayload.headers
  }
  var postData = {
    name: 'web',
    config: {
      url: config.callbackURL,
      content_type: 'json'
    },
    events: ['push'],
    active: false
  }

  return axios.post(url, postData, payload)
}

// [TODO]: remove this shit
function confusingInit () {
  return new Promise(function (fulfill, reject) {
    getHooks(function (hooks) {
      var pushHook = _.find(hooks, function (hook) {
        return hook.config === config.callbackURL + '/push'
      })

      if (!pushHook) {
        createHook({ event: 'push' }, fulfill, reject)
      }
    }, reject)
  })
}

function getHooks (callback, errCallback) {
  var payload = _.merge(defaultPayload, {
    path: '/orgs/' + config.owner
  })
  return sendRequest(payload, {}, getChunksParser(callback), errCallback)
}

function createHook (data, callback, errCallback) {
  var payload = _.merge(defaultPayload, {
    method: 'POST',
    path: '/orgs/' + config.owner
  })
  return sendRequest(payload, {
    name: 'web',
    config: {
      url: config.callbackURL + '/' + data.event,
      content_type: 'json'
    },
    events: [data.event],
    active: false
  }, getChunksParser(callback), errCallback)
}

function fetchFile (data, callback, errCallback) {
  var payload = _.merge(defaultPayload, {
    path: '/repos/' + data.owner + '/' + data.repo +
      '/contents/' + data.path + '?ref=' + data.sha
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
    console.error(err)
    errCallback.apply(req, arguments)
  })
  if (data) req.write(JSON.stringify(data))
  req.end()
}

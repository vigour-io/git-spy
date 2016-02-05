var https = require('https')
var log = require('npmlog')
var _ = require('lodash')
var btoa = require('btoa')

var hostName = 'api.github.com'
var defaultPayload = {
  hostname: hostName,
  method: 'GET',
  path: undefined,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
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
    var auth = btoa(config.gitUsername + ':' + config.gitPassword)
    defaultPayload.headers['Authorization'] = 'Basic ' + auth
    return ensureHook()
  }
}

function ensureHook () {
  return getHooks()
    .then((res) => {
      var pushHook = _.find(res, (hook) => {
        return hook.config.url === config.callbackURL
      })
      if (!pushHook) {
        return createHook({ event: 'push' })
      }
    })
}

function getHooks () {
  var payload = cloneMerge(defaultPayload, {
    path: '/orgs/' + config.owner + '/hooks'
  })
  return sendRequest(payload, false, 200)
    .then((str) => {
      return JSON.parse(str)
    })
}

function createHook (data) {
  var payload = cloneMerge(defaultPayload, {
    method: 'POST',
    path: '/orgs/' + config.owner + '/hooks'
  })
  return sendRequest(payload, {
    name: 'web',
    config: {
      url: config.callbackURL,
      content_type: 'json'
    },
    events: [data.event],
    active: false
  }, 201)
}

function fetchFile (data) {
  var payload = cloneMerge(defaultPayload, {
    path: '/repos/' + data.owner + '/' + data.repo +
      '/contents/' + data.path + '?ref=' + data.sha,
    headers: {
      Accept: 'application/vnd.github.v3.raw+json'
    }
  })
  return sendRequest(payload, false, 200)
}

function sendRequest (options, data, expectedStatusCode) {
  return new Promise(function (resolve, reject) {
    if (config.verbose) {
      log.info('git-spy', 'sending request', options, 'data', data)
    }
    var req = https.request(options, function (res) {
      var total = ''
      res.on('error', reject)
      res.on('data', function (chunk) {
        total += chunk
      })
      res.on('end', function () {
        if (expectedStatusCode && expectedStatusCode !== res.statusCode) {
          var error = new Error('Unexpected response')
          error.response = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: total
          }
          reject(error)
        } else {
          resolve(total)
        }
      })
    })
    req.on('error', reject)
    if (data) {
      req.write(JSON.stringify(data))
    }
    req.end()
  })
}

function cloneMerge () {
  var args = [].slice.apply(arguments)
  var src = args.shift()
  var newObj = _.cloneDeep(src)
  args.unshift(newObj)
  return _.merge.apply(this, args)
}

'use strict'

var url = require('url')
var https = require('https')
var http = require('http')
var log = require('npmlog')
var _cloneDeep = require('lodash.clonedeep')
var _merge = require('lodash.merge')
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
var defaultGwfPayload = _cloneDeep(defaultPayload)

var config

module.exports = {
  authenticated: false,
  token: undefined,
  initialized: false,
  createHook: createHook,
  fetchFile: fetchFile,
  init: function (cfg) {
    config = cfg
    var auth = btoa(config.gitUsername + ':' + config.gitPassword)
    defaultPayload.headers['Authorization'] = 'Basic ' + auth
    var gwfAuth = btoa(config.gwfUser + ':' + config.gwfPass)
    defaultGwfPayload.headers['Authorization'] = 'Basic ' + gwfAuth
    return ensureHook()
  }
}

function ensureHook () {
  return createHook({ event: 'push' })
}

function createHook (data) {
  var gwfURL = url.parse(config.gwfURL)
  var payload = cloneMerge(defaultGwfPayload, {
    method: 'POST',
    hostname: gwfURL.hostname,
    port: parseInt(gwfURL.port, 10),
    path: '/subscribe?url=' + config.callbackURL
  })
  var dataObj = {
    name: 'web',
    config: {
      url: config.callbackURL,
      content_type: 'json'
    },
    events: [data.event],
    active: false
  }
  if (config.verbose) {
    log.info('creating hook')
  }
  return sendRequest(payload, dataObj, 201)
}

function fetchFile (data) {
  var payload = cloneMerge(defaultPayload, {
    path: '/repos/' + data.owner + '/' + data.repo +
      '/contents/' + data.path + '?ref=' + data.sha,
    headers: {
      Accept: 'application/vnd.github.v3.raw+json'
    }
  })
  return sendRequest(payload, false, 200, true)
}

function sendRequest (options, data, expectedStatusCode, secure) {
  return new Promise(function (resolve, reject) {
    if (config.verbose) {
      log.info('git-spy', 'sending request', options, 'data', data)
    }
    var req = (secure ? https : http).request(options, function (res) {
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
    req.on('error', function (err) {
      reject(err)
    })
    if (data) {
      req.write(JSON.stringify(data))
    }
    req.end()
  })
}

function cloneMerge () {
  var args = [].slice.apply(arguments)
  var src = args.shift()
  var newObj = _cloneDeep(src)
  args.unshift(newObj)
  return _merge.apply(this, args)
}

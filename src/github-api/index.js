var https = require('https')
  , _ = require('lodash')
  // , hookListener = require('./hookListener')
  , log = require('npmlog')
  , restify = require('restify');


var githubApi = module.exports = {
  authenticated: false,
  initialized: false,
  createHook: createHook,
  getHooks: getHooks,
  fetchFile: fetchFile,
  init: init,
  authenticate: function(config) {
    this.authenticated = true
    this.token = config.user.token;
  }
};


function init (callback, errCallback) {
  connect()
  getHooks(function (hooks) {
    var pushHook = _.find(hooks, function(hook) {
      return hook.config === config.items.hooks.callbackUrl + '/push'
    })
    if (!pushHook) {
      createHook({event: 'push'}, callback, errCallback)
    }
  }, errCallback)
}




function serveCode (code) {
  return function (req, res) {
    res.status(code).end(code + " " + req.originalUrl)
  }
}

function getChunksParser (callback) {
  return function (resp) {
    var total = ""
    resp.on("data", function (chunk) {
      total += chunk
    })
    resp.on("end", function () {
      callback(total)
    })
  }
}

function sendRequest (config, data, callback, errCallback) {
  if (!githubApi.authenticated) {
    throw new Error("You are not authenticated")
  }

  var req = https.request(config, callback)
  req.on("error", function (err) {
    log.warn('http error', err)
    errCallback.apply(req, arguments)
  })
  if (data) req.write(JSON.stringify(data))
  req.end()
}

function fetchFile (data, callback, errCallback) {
  return sendRequest({
    hostname: config.items.gitHub.hostName,
    method: 'GET',
    path: '/repos/' + data.owner + '/' + data.repo + '/contents/' + data.path + '?ref=' + data.sha,
    headers: {
      'Accept': 'application/vnd.github.v3.raw+json',
      'Authorization': 'token ' + githubApi.token,
      'User-Agent': 'vigour-git-spy'
    }
  }, {}, getChunksParser(callback), errCallback)
}

function createHook (data, callback, errCallback) {
  return sendRequest({
    hostname: config.items.gitHub.hostName,
    method: 'POST',
    path: '/orgs/' + config.items.organization.login,
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': 'token ' + githubApi.token,
      'User-Agent': 'vigour-git-spy'
    }
  }, {
    name: 'web',
    config: {
      url: config.items.hooks.callbackUrl + '/' + data.event,
      content_type: 'json'
    },
    events: [data.event],
    active: false
  }, getChunksParser(callback), errCallback)
}

function getHooks (callback, errCallback) {
  return sendRequest({
    hostname: config.items.gitHub.hostName,
    method: 'GET',
    path: '/orgs/' + config.items.organization.login,
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': 'token ' + githubApi.token,
      'User-Agent': 'vigour-git-spy'
    }
  }, {}, getChunksParser(callback), errCallback)
}



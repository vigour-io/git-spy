var oboe = require('oboe')
  , log = require('npmlog')
  // , hooks = require('./subscriptions')


module.exports = function (req, res) {
  var h
    , before
    , after
    , ref
    , repoId
    , owner
    , branch
    , c = {}
    , f = {}
  log.info("Received hookshot")
  oboe(req)
    .node('before', function (b) {
      before = b
      return oboe.drop
    })
    .node('after', function (a) {
      after = a
      return oboe.drop
    })
    .node('ref', function (refData) {
      ref = refData
      return oboe.drop
    })
    .node('repository.name', function (name) {
      repoId = name
      return oboe.drop
    })
    .node('repository.owner.name', function (name) {
      owner = name
      return oboe.drop
    })
    .node('head_commit.id', function (headCommit) {
      h = headCommit
      return oboe.drop
    })
    .node('commits.*.id', function (commitId, path, ancestors) {
      c[commitId] = {
        files: [],
        timestamp: ''
      }
    })
    .node('commits.*.timestamp', function (timestamp, path, ancestors) {
      var commitId = ancestors[ancestors.length-2].id
      c[commitId].timestamp = timestamp
      return oboe.drop
    })
    .node('commits.*.modified.*', function (file, path, ancestors) {
      var commitId = ancestors[ancestors.length-3].id
      c[commitId].files.push(file)
      f[file] = true
      return oboe.drop
    })
    .node('commits.*.added.*', function (file, path, ancestors) {
      var commitId = ancestors[ancestors.length-3].id
      c[commitId].files.push(file)
      f[file] = true
      return oboe.drop
    })
    .node('*', function (a, path, ancestors) {
      if (path[0] === 'commits' && path[path.length - 1] === 'id') return
      return oboe.drop;
    })
    .done(function (body) {
      finish.call(this)
    })

  function finish () {
    branch = ref.slice(ref.lastIndexOf('/') + 1)
    var hookData = {
      'repoId': repoId,
      'owner': owner,
      'branch': branch,
      'headCommitId': h,
      'before': before,
      'after': after,
      'files': Object.keys(f),
      'commits': c
    }
    try {
      // hooks.callHookNotifier(hookData)
      console.log(hookData)
    } catch (e) {
      res.status(400).end()
    }
    res.status(202).end()
  }
}
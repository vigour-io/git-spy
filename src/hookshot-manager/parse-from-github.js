var Promise = require('bluebird')
  , oboe = require('oboe')
  , log = require('npmlog');


module.exports = function (req) {
  var parser = new OboeParser();
  return new Promise(function(fulfill, reject){
    oboe(req)
    .node( 'before', parser.before.bind(parser) )
    .node( 'after', parser.after.bind(parser) )
    .node( 'ref', parser.refData.bind(parser) )
    .node( 'repository.name', parser.repoName.bind(parser) )
    .node( 'repository.owner.name', parser.ownerName.bind(parser) )
    .node( 'head_commit.id', parser.headCommitId.bind(parser) )
    .node( 'commits.*.id', parser.commits.bind(parser) )
    .node( 'commits.*.timestamp', parser.commitsTimestamp.bind(parser) )
    .node( 'commits.*.modified.*', parser.commitsModified.bind(parser) )
    .node( 'commits.*.added.*', parser.commitsAdded.bind(parser) )
    .node( '*', parser.checkPath.bind(parser) )
    .done(function (body) {
      var hookData = parser.hookData;
      hookData.branch = hookData.ref && hookData.ref.split('/').pop();
      hookData.files = hookData.files && Object.keys( hookData.files );
      fulfill( hookData );
    })
    .fail( reject );
  });
};

var OboeParser = function(hookData){
  this.hookData = {};
};

OboeParser.prototype = {
  before: function (before) {
    this.hookData.before = before;
    return oboe.drop
  },
  after: function (after) {
    this.hookData.after = after;
    return oboe.drop
  },
  refData: function (refData) {
    this.hookData.ref = refData;
    return oboe.drop
  },
  repoName: function (name) {
    this.hookData.repo = name;
    return oboe.drop
  },
  ownerName: function (name) {
    this.hookData.owner = name;
    return oboe.drop
  },
  headCommitId: function (headCommit) {
    this.hookData.headCommit = headCommit;
    return oboe.drop
  },
  commits: function (commitId, path, ancestors) {
    this.hookData.commits = this.hookData.commits || {};
    this.hookData.commits[commitId] = {
      files: [],
      timestamp: ''
    }
  },
  commitsTimestamp: function (timestamp, path, ancestors) {
    var commitId = ancestors[ancestors.length-2].id
    this.hookData.commits[commitId].timestamp = timestamp
    return oboe.drop
  },
  commitsModified: function (file, path, ancestors) {
    this.hookData.files = this.hookData.files || {};
    var commitId = ancestors[ancestors.length-3].id
    this.hookData.commits[commitId].files.push(file)
    this.hookData.files[file] = true;
    return oboe.drop
  },
  commitsAdded: function (file, path, ancestors) {
    this.hookData.files = this.hookData.files || {};
    var commitId = ancestors[ancestors.length-3].id
    this.hookData.commits[commitId].files.push(file)
    this.hookData.files[file] = true
    return oboe.drop
  },
  checkPath: function (a, path, ancestors) {
    if (path[0] === 'commits' && path[path.length - 1] === 'id'){
      return;
    }
    return oboe.drop;
  }
};


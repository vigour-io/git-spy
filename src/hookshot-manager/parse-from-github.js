var Promise = require('bluebird')
  , oboe = require('oboe')
  , log = require('npmlog');


module.exports = function (req) {
  var hookData = {};
  return new Promise(function(fulfill, reject){
    oboe(req)
    .node( 'before', before(hookData) )
    .node( 'after', after(hookData) )
    .node( 'ref', refData(hookData) )
    .node( 'repository.name', repoName(hookData) )
    .node( 'repository.owner.name', ownerName(hookData) )
    .node( 'head_commit.id', headCommitId(hookData) )
    .node( 'commits.*.id', commits(hookData) )
    .node( 'commits.*.timestamp', commitsTimestamp(hookData) )
    .node( 'commits.*.modified.*', commitsModified(hookData) )
    .node( 'commits.*.added.*', commitsAdded(hookData) )
    .node( '*', checkPath(hookData) )
    .done(function (body) {
      hookData.files = hookData.files && Object.keys( hookData.files );
      fulfill( hookData );
    })
    .fail( reject );
  });
};

var before = function(hookData){
  return function (before) {
    hookData.before = before;
    return oboe.drop
  };
};

var after = function(hookData){
  return function (after) {
    hookData.after = after;
    return oboe.drop
  };
};

var refData = function(hookData){
  return function (refData) {
    hookData.ref = refData;
    return oboe.drop
  };
};

var repoName = function(hookData){
  return function (name) {
    hookData.repo = name;
    return oboe.drop
  };
};

var ownerName = function(hookData){
  return function (name) {
    hookData.owner = name;
    return oboe.drop
  };
};

var headCommitId = function(hookData){
  return function (headCommit) {
    hookData.headCommit = headCommit;
    return oboe.drop
  };
};

var commits = function(hookData){
  return function (commitId, path, ancestors) {
    hookData.commits = hookData.commits || {};
    hookData.commits[commitId] = {
      files: [],
      timestamp: ''
    }
  };
};

var commitsTimestamp = function(hookData){
  return function (timestamp, path, ancestors) {
    var commitId = ancestors[ancestors.length-2].id
    hookData.commits[commitId].timestamp = timestamp
    return oboe.drop
  };
};

var commitsModified = function(hookData){
  return function (file, path, ancestors) {
    hookData.files = hookData.files || {};
    var commitId = ancestors[ancestors.length-3].id
    hookData.commits[commitId].files.push(file)
    hookData.files[file] = true;
    return oboe.drop
  };
};

var commitsAdded = function(hookData){
  return function (file, path, ancestors) {
    hookData.files = hookData.files || {};
    var commitId = ancestors[ancestors.length-3].id
    hookData.commits[commitId].files.push(file)
    hookData.files[file] = true
    return oboe.drop
  };
};

var checkPath = function(hookData){
  return function (a, path, ancestors) {
    if (path[0] === 'commits' && path[path.length - 1] === 'id'){
      return;
    }
    return oboe.drop;
  }
};
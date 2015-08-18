var Promise = require('bluebird')
  , _ = require('lodash')
  , diff = require('./diff');

var match = module.exports = function(hookshotData){
  var spy = require('./');
  var subs = spy.subscriptions;
  var matched = tryToMatch(spy.subscriptions, hookshotData);

  var callbacks = matched.map(function(sub){
    return sub.callback;
  })
  .filter(function(item, idx, arr){
    return arr.indexOf(item) === idx;
  });

  return getFilesDiff(hookshotData)
    .then(function(diffs){
      console.log('diffs', diffs);
    })
    .catch(function (err) {
      console.log('error', err.stack)
    });;
};

var getFilesDiff = function getFilesDiff(hookshotData){
  var factory = fetchFileFactory(hookshotData);
  var files = hookshotData.files;
  var promises = [];
  for(var i = 0, l = hookshotData.files.length; i < l; i++){
    var file = files[i];
    promises.push( factory(file) );
  }
  return Promise.all(promises)
    .then(function(res){
      var diffs = {};
      for(var i = 0, l = files.length; i < l; i++){
        var file = files[i];
        diffs[file] = res[i];
      }
      return diffs;
    });
}

var tryToMatch = function tryToMatch(subs, hookshot){
  var matched = [];
  var repo = hookshot.repo;
  var branch = hookshot.branch;
  var files = hookshot.files;

  for(var i = 0, l = subs.length; i < l; i++){
    var sub = subs[i];
    var repos = Object.keys(sub);
    if( !~repos.indexOf('*') && !~repos.indexOf(repo) ){
      continue;
    }
    var branches = sub['*'] || sub[repo];
    if(branches === true){
      matched.push(sub);
      continue;
    }

    var branchesKeys = Object.keys(branches);
    
    if( !~branchesKeys.indexOf('*') && !~branchesKeys.indexOf(branch) ){
      continue;
    }
    var subFiles = branches['*'] || branches[branch];
    if(subFiles === true){
      matched.push(sub);
      continue;
    }
    subFiles = Object.keys(subFiles);
    var intersection = _.intersection(subFiles, files);
    if( intersection.length > 0 ){
      matched.push(sub);
    }

  }
  return matched;
};

function fetchFile (owner, repo, path, sha) {
  githubApi = require('../github-api')
  return new Promise(function (resolve, reject) {
    githubApi.fetchFile({
      owner: owner,
      repo: repo,
      path: path,
      sha: sha
    }, resolve, reject)
  })
}

function fetchFileFactory (hookshotData) {
  return function(filePath) {
    var after, before;
    return fetchFile(hookshotData.owner, hookshotData.repo, filePath, hookshotData.after)
      .then(function (resp) {
        after = JSON.parse(resp);
        return fetchFile(hookshotData.owner, hookshotData.repo, filePath, hookshotData.before)
      }).then(function (resp) {
        before = JSON.parse(resp);
        return diff(before, after);
      })
  }
}

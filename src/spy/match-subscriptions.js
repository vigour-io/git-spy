var Promise = require('bluebird')
  , _ = require('lodash');

var match = module.exports = function(hookshotData){
  var path = ['repo', 'branch', 'files'];
  var spy = require('./');

  return new Promise(function(fulfill, reject){
    var subs = spy.subscriptions;
    var matched = tryToMatch(spy.subscriptions, hookshotData);

    var callbacks = matched.map(function(sub){
      return sub.callback;
    })
    .filter(function(item, idx, arr){
      return arr.indexOf(item) === idx;
    });

    return fulfill(callbacks);
  });
};

var tryToMatch = function(subs, hookshot){
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
}
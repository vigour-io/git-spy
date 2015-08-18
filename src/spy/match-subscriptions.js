var Promise = require('bluebird')
  , _ = require('lodash');

var match = module.exports = function(hookshotData, subscription){
  var repo = hookshotData.repo;
  var branch = hookshotData.branch;
  var files = hookshotData.files;

  return new Promise(function(fulfill, reject){


    return fulfill(false);
  });
};

var flattenSubscription = function(subscription){
  var subscriptions = Object.keys(subscription);
};


var check = function(what, where, stop){

}
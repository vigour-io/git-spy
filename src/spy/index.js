var matchSubscriptions = require( './match-subscriptions' )
  , subscriptions = [];



var spy = module.exports = {
  subscriptions: subscriptions,
  match: matchSubscriptions,
  on: function(pattern, callback){
    var patterns = [];
    var repos = Object.keys(pattern);
    for(var i = 0, l = repos.length; i < l; i++){
      var pat = {};
      var repo = repos[i]; 
      pat[repo] = pattern[repo];
      pat.callback = callback;
      subscriptions.push(pat);
    }
  }
  // match: function(hookshotData){
  //   return new Promise(function(fulfill, reject){
  //     if(!hookshotData){
  //       reject( Error('you have to pass hookshotData') );
  //     }
  //     var callbacksToExecute = [];
  //     var callbacksToTrack = [];
  //     var subsWithFields = [];
  //     var getDiffsPromises = [];

  //     for(var i = 0, l = subscriptions.length; i < l; i++){
  //       var sub = subscriptions[i];
  //       // checking for repo
  //       if( !checkInArray(hookshotData.repoId, sub.repo) ){
  //         continue;
  //       }

  //       // //checking for branch
  //       var outBranch = hookshotData.branch;
  //       if( sub.branch && !checkInArray(hookshotData.branch, sub.branch) ){
  //         continue;
  //       }

  //       // // checking for files
  //       if ( sub.files ) {
  //         var fileNames = _.pluck(sub.files, 'path')
  //           , intersection = [];
  //         if (_.contains(fileNames, '*')) {
  //           intersection = hookshotData.files
  //         } else {
  //           intersection = _.intersection(hookshotData.files, fileNames);
  //         }
  //         if(intersection.length === 0){
  //           continue;
  //         } else {
  //           (function (subscription, filesToMatch) {
  //             var getDiffPromise = getDiffs(filesToMatch, hookshotData)
  //               .then(function (diffs) {
  //                 var files = []
  //                 for(var i = 0, l = filesToMatch.length; i < l; i++){
  //                   var file = _.filter(subscription.files, function (subFile) {
  //                     return subFile.path === '*' || subFile.path === filesToMatch[i]
  //                   })[0];
  //                   var fileToCheckDiff = {}
  //                   fileToCheckDiff.diff = diffs[i]
  //                   fileToCheckDiff.fields = file.fields
  //                   files.push(fileToCheckDiff);
  //                 }
  //                 var checkedDiffs = checkDiffForFields(files)
  //                 var diffForACallback = _.reduce(checkedDiffs, function (result, diff) {
  //                   result[Object.keys(diff.diff)[0]] = diff.diff[Object.keys(diff.diff)[0]]
  //                   return result
  //                 }, {})
  //                 if( checkedDiffs.length ){
  //                   if( !~callbacksToTrack.indexOf(subscription.callback) ){
  //                     callbacksToTrack.push( subscription.callback );
  //                     callbacksToExecute.push({
  //                       fn: subscription.callback,
  //                       args: diffForACallback
  //                     })
  //                   }
  //                 }
  //               })
  //             getDiffsPromises.push(getDiffPromise)
  //           })(sub, intersection)
  //         }
  //       }
  //     }
  //     Promise.all(getDiffsPromises).then(function () {
  //       fulfill( callbacksToExecute );
  //       _.each(callbacksToExecute, function(callback){
  //         callback.fn.call(null, hookshotData, callback.args)
  //       })
  //     })
  //   });
  // }
};

var checkDiffForFields = function(files){
  return _.filter(files, function (file) {
    if (_.isUndefined(file.fields)) {
      return true
    } else {
      var fileName = Object.keys(file.diff)[0]
      var diffFields = Object.keys(flattenObject(file.diff[fileName]))
      return !!_.intersection(diffFields, file.fields).length
    }
  })
   //return true or false weather we want callback executed or not
}

var getDiffs = function(files, hookshotData){
  var promises = [];
  for(var i = 0, l = files.length; i < l; i++){
    var promise = magicCallAPI(files[i], hookshotData)
    promises.push(promise);
  }
  return Promise.all(promises);
}


var magicCallAPI = function (filePath, hookshotData) {
  var resp = {}
  resp[filePath] = {'version': '0.1.0'}
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(resp)
    }, 500)
  })
}

var checkInArray = function(what, where){
  where = Array.isArray(where)? where : [where];
  if( ~where.indexOf('*') || ~where.indexOf(what) ){
    return true;
  }
  return false;
};

var flattenObject = function(ob, delimiter) {
  var delimiter = delimiter || '.';
  var toReturn = {};

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if ((typeof ob[i]) == 'object') {
      var flatObject = flattenObject(ob[i], delimiter);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + delimiter + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};



;(function(){

  var output = {
    "repoId": "mtv-play",
    "owner": "vigour-io",
    "branch": "master",
    "headCommitId": "ba7038c75d60682ab2872d7b542748def213d8d9",
    "before": "31d8f83742989af026cae686214c6e0984afa17a",
    "after": "ba7038c75d60682ab2872d7b542748def213d8d9",
    "files": ["package.json0", "package.json", "package.json2"],
    "commits": {
        "ba7038c75d60682ab2872d7b542748def213d8d90": {
            "files": ["package.json0"],
            "timestamp": "2015-08-03T15:31:19+02:00"
        },
        "ba7038c75d60682ab2872d7b542748def213d8d91": {
            "files": ["package.json"],
            "timestamp": "2015-08-03T15:31:19+02:00"
        },
        "ba7038c75d60682ab2872d7b542748def213d8d92": {
            "files": ["package.json2"],
            "timestamp": "2015-08-03T15:31:19+02:00"
        },
        "ba7038c75d60682ab2872d7b542748def213d8d93": {
            "files": ["package.json"],
            "timestamp": "2015-08-03T15:31:19+02:00"
        }
    }
}

  var pattern1 = {
    repo: [
      'vjs'
    ],
    branch: [
      'master'
    ],
    files: [ 
      'package.json'
    ]
  }

});


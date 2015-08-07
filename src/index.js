var _ = require('lodash');
var Promise = require('bluebird')
var subscriptions = [];

var spy = module.exports = {
  subscriptions: subscriptions,
  on: function(pattern, callback){
    pattern.callback = callback;
    subscriptions.push(pattern);
  },

  match: function(hookshotData){
    return new Promise(function(fulfill, reject){
      if(!hookshotData){
        reject( Error('you have to pass hookshotData') );
      }
      var callbacksToExecute = [];
      var subsWithFields = [];

      for(var i = 0, l = subscriptions.length; i < l; i++){
        var sub = subscriptions[i];
        // checking for repo
        if( !checkInArray(hookshotData.repoId, sub.repo) ){
          continue;
        }

        // //checking for branch
        var outBranch = hookshotData.branch;
        if( sub.branch && !checkInArray(hookshotData.branch, sub.branch) ){
          continue;
        }

        // // checking for files
        if(sub.files){
          var fileNames = _.pluck(sub.files, 'path'); 
          console.log('files', fileNames);
          var intersection = _.intersection(hookshotData.files, fileNames);
          if(intersection.length === 0){
            continue;
          }
        }

        if(sub.fields){

        }


        if( !~callbacksToExecute.indexOf(sub.callback) ){
          callbacksToExecute.push( sub.callback );
        }
      }
console.log(0)
      if(subsWithFields.length === 0){console.log(1)
        fulfill( callbacksToExecute );
      } else {

      }

    });
  }
};

var checkForFields = function(files, fields){
  return new Promise(function(fulfill, reject){
    //make request for diff for each file
    setTimeout(function(){
      var response = {
        'package.json':{
          version: "1.0.0"
        }
      };

      fulfill(true);
    }, 200)
  })
}


var checkInArray = function(what, where){
  where = Array.isArray(where)? where : [where];
  if( ~where.indexOf('*') || ~where.indexOf(what) ){
    return true;
  }
  return false;
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


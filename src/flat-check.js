var _ = require('lodash');
var Promise = require('bluebird')
var subscriptions = [];

function fetchFileFactory (hookshotData) {
  return function(filePath) {
    var resp =  {
      'gaston': {'version': '0.1.0'}
    }
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(resp)
      }, 500)
    })
  }
}

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

function listyFy (obj, withVal) {
  var flat = flattenObject(obj, '|')
  return _.map(flat, function(v, k){
    var val = k.split('|')
    if (withVal) {
      val.push(v)
      val.push(true)
    }
    return val
  })
}

function checkSubscription(subscription, outputList) {
  var matchPromises = []
  var matchedTriggers = []
  for (var i = 0, l = subscription.triggers.length; i<l; i++) {
    var trigger = subscription.triggers[i];
    for (var j = 0, ll = outputList.length; j<ll; j++) {
      var output = outputList[j]
      var theMatchPromise = compare(trigger, output)
      theMatchPromise.then(function (comparison) {
          if (comparison.result) {
            if ( !~matchedTriggers.indexOf(comparison) ){
              matchedTriggers.push(comparison)
            }
          }
          return comparison.trigger
        })
      matchPromises.push(theMatchPromise)
    }
  }
  return Promise.all(matchPromises).then(function (res){
    return matchedTriggers
  })
}

function coupleCompare (trigger, output) {
  return new Promise(function (resolve) {
    resolve(trigger === '*' || trigger === output)
  })
}

function isJSON(path) {
  return path.slice(path.lastIndexOf('.') + 1).toLowerCase() === 'json'
}

function compare (trigger, output) {

  function reducer (total, comparison, i){
    if (output[i]) {
      return coupleCompare(trigger[i], output[i])
        .then(assignTotal(total))
    } else if (trigger[i-1] === '*' || trigger[i-1] === output[i-1]) {
      console.log(isJSON(output[i-1]))
      if (isJSON(output[i-1])) {
        return spy.fetchFile(output[i-1])
          .then(function (diff) {
            output = output.concat(listyFy(diff, true)[0])
            return coupleCompare(trigger[i], output[i])
              .then(assignTotal(total))
          })
      } else {
        return Promise.resolve(true)
      }
    }
  }

  function assignTotal (total) {
    return function (result) {
      return total = result
    }
  }

  return Promise.reduce(trigger, reducer, false)
    .then(function (finalResult) {
      return {
        result: finalResult,
        trigger: trigger,
        output: output
      }
    })
}

function expand (arr){
  var output = {}
  var sliced = arr.slice(1, arr.length)
  if (arr.length >= 1) {
    if (arr[0] === true) {
      output = arr[0]
    } else {
      output[arr[0]] = expand(sliced)
    }
  }
  return output
}

function parseDiff (obj, output) {
  var output = output || {};
  _.each(obj, function(val, key){
    if (val === true) {
      output.value = key
    } else {
      output[key] = {}
      parseDiff(val, output[key])
    }
  })
  return output
}

var spy = module.exports = {
  on: function(pattern, callback){
    var subscription = {
      triggers: listyFy(pattern)
    }
    subscription.callback = callback
    subscriptions.push(subscription);
  },
  match: function (hookshotData) {
    this.fetchFile = fetchFileFactory(hookshotData)
    var outputObj = {}
    outputObj[hookshotData.repoId] = {}
    outputObj[hookshotData.repoId][hookshotData.branch] = {}
    outputObj[hookshotData.repoId][hookshotData.branch] =
      _.reduce(hookshotData.files, function (result, key) {
        result[key] = true
        return result
      }, {})

    var outputList = listyFy(outputObj)
    var subscriptionCheckPromises = []
    _.each(subscriptions, function (subscription) {
      var promise = checkSubscription(subscription, outputList).then(function (res) {
        var outputs = []
          , extended
        _.each(res, function (result) {
          outputs.push(expand(result.output))
          extended = _.merge(parseDiff(expand(result.output)), extended || {})
        })
        return {
          diff: extended,
          callback: subscription.callback
        }
      })
      subscriptionCheckPromises.push(promise)
    })
    Promise.all(subscriptionCheckPromises).then(function (result) {
      _.each(result, function (subscription) {
        console.log(subscription.callback)
        subscription.callback(hookshotData, subscription.diff)
      })
    })
  }
}
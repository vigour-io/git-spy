var _intersection = require('lodash/array/intersection')

module.exports = function (hookshotData, diffs) {
  var spy = require('./')

  return tryToMatch(spy.subscriptions, hookshotData, diffs)
    .map(function (sub) {
      return sub.callback
    })
    .filter(function (item, idx, arr) {
      return arr.indexOf(item) === idx
    })
}

var tryToMatch = function tryToMatch (subs, hookshot, diffs) {
  var matched = []
  var repo = hookshot.repo
  var branch = hookshot.branch
  var files = hookshot.files

  for (var i = 0, l = subs.length; i < l; i++) {
    var sub = subs[i]
    var repos = Object.keys(sub)
    if (repos[repos.length - 1] === 'callback') {
      repos.pop()
    }

    if (!~repos.indexOf('*') && !~repos.indexOf(repo)) {
      continue
    }

    var branches = sub['*'] || sub[repo]
    if (branches === true) {
      matched.push(sub)
      continue
    }

    var branchesKeys = Object.keys(branches)
    if (!~branchesKeys.indexOf('*') && !~branchesKeys.indexOf(branch)) {
      continue
    }

    var subFiles = branches['*'] || branches[branch]
    if (subFiles === true) {
      matched.push(sub)
      continue
    }

    var subFilesKeys = Object.keys(subFiles)
    var intersection = _intersection(subFilesKeys, files)
    if (intersection.length === 0) {
      continue
    }

    // for (var j = 0, ll = intersection.length; j < ll; j++) {
    //   var file = intersection[j]
    //   var subFile = subFiles[file]
    //   if (subFile === true) {
    matched.push(sub)
      //   break
      // }

      // var subFields = Object.keys(subFile)
      // if (matchFields(file, subFields, diffs)) {
      //   matched.push(sub)
      //   break
      // }
    // }
  }
  return matched
}

// var matchFields = function matchFields (file, subFields, diffs) {
//   var thisDiff = diffs[file]
//   for (var i = 0, l = subFields.length; i < l; i++) {
//     var parsedField = subFields[i].split('.')
//     var ll = parsedField.length
//     for (var j = 0; j < ll; j++) {
//       thisDiff = thisDiff[parsedField[j]]
//       if (!thisDiff) {
//         break
//       }
//       if (j === ll - 1) {
//         return true
//       }
//     }
//   }
//   return false
// }

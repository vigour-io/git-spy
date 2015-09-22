var parseDiff = require('./parse-diffs')
var githubApi = require('../github-api')

module.exports = function getFilesDiff (hookshotData) {
  var factory = fetchFileFactory(hookshotData)
  var files = hookshotData.files
  var promises = []
  for (var i = 0, l = hookshotData.files.length; i < l; i++) {
    var file = files[i]
    promises.push(factory(file))
  }
  return Promise.all(promises)
    .then(function (res) {
      var diffs = {}
      for (var i = 0, l = files.length; i < l; i++) {
        var file = files[i]
        diffs[file] = res[i]
      }
      return diffs
    })
}

var fetchFileFactory = function fetchFileFactory (hookshotData) {
  return function (filePath) {
    var after, before
    return fetchFile(hookshotData.owner, hookshotData.repo, filePath, hookshotData.after)
      .then(function (resp) {
        after = JSON.parse(resp)
        return fetchFile(hookshotData.owner, hookshotData.repo, filePath, hookshotData.before)
      })
      .then(function (resp) {
        before = JSON.parse(resp)
        return parseDiff(before, after)
      })
  }
}

var fetchFile = function fetchFile (owner, repo, path, sha) {
  return new Promise(function (resolve, reject) {
    githubApi.fetchFile({
      owner: owner,
      repo: repo,
      path: path,
      sha: sha
    }, resolve, reject)
  })
}

var fs = require('fs')
var path = require('path')
var parseFromGithub = require('../../src/hookshot-manager').parseFromGithub

describe('hookshotManager.parsefromGithub', function () {
  it('should return the expected result', function () {
    var expectedResult = require('../mocks/hookshot-result.json')
    var dataPath = path.join(__dirname, '../mocks/hookshot-data.json')
    var rStream = fs.createReadStream(dataPath)
    parseFromGithub(rStream)
      .then(function (hookData) {
        assert.deepEqual(hookData, expectedResult)
      })
  })
})

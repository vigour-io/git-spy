var config = require('../../config')
var request = require('request')
var server = require('../../src/server')
var serverURL = 'http://localhost:' + config.testPort
var mocks = {
  hookshotData: require('../mocks/hookshot-data')
}

describe('restify server', function () {
  before(function () {
    config.port = config.testPort
    return server.start(config)
  })

  after(function () {
    server.stop()
  })

  it('should start the server', function () {
    assert.ok(server.running)
  })

  it('should handle 404s', function (done) {
    request.get(serverURL + '/some-faulty-url', function (err, res, body) {
      assert.notOk(err)
      assert.equal(res.statusCode, 404)
      done()
    })
  })

  it('should return 202 (Accepted) for post requests to /push', function (done) {
    var data = { json: mocks.hookshotData }
    request.post(serverURL + '/push', data, function (err, res, body) {
      assert.notOk(err)
      assert.equal(res.statusCode, 202)
      assert.equal(body, 'ACCEPTED')
      done()
    })
  })
})

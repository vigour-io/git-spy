var log = require('npmlog')
var config = require('../../config')
var spy = require('../../src/spy')
var githubApi = require('../../src/github-api')
var mocks = {
  patterns: require('../mocks/patterns'),
  hookshotData: require('../mocks/hookshot-result')
}

describe('executing the callbacks', function () {
  before(function () {
    return githubApi.init(config)
      .then(function (resp) {
        log.info('githubApi initialized')
      })
      .catch(function (err) {
        log.warn('githubApi failed to initialize', err)
      })
  })

  beforeEach(function () {
    spy.clearSubscriptions()
  })

  it('should execute callback for hookshotData', function () {
    // var diffs
    var callbacks
    var hookshotData = mocks.hookshotData
    var cb = sinon.spy()
    spy.on(mocks.patterns['file with fields'], cb)
    return spy.match(hookshotData)
      .then(function (res) {
        callbacks = res.callbacks
        // diffs = res.diffs
        assert.equal(callbacks.length, 1)
        assert.equal(callbacks[0], cb)
      })
      .then(function () {
        spy.executeCallbacks(callbacks, hookshotData/*, diffs*/)
      })
      .then(function () {
        // cb.should.have.been.called
        expect(cb).to.have.been.called
      })
  })

  it('more than one match should only fire one callback', function () {
    var diffs, callbacks
    var hookshotData = mocks.hookshotData
    var cb = sinon.spy()
    spy.on(mocks.patterns['file with fields'], cb)
    spy.on(mocks.patterns['all repos'], cb)
    return spy.match(hookshotData)
      .then(function (res) {
        callbacks = res.callbacks
        diffs = res.diffs
        assert.equal(callbacks.length, 1)
        assert.equal(callbacks[0], cb)
      })
      .then(function () {
        spy.executeCallbacks(callbacks, hookshotData, diffs)
      })
      .then(function () {
        // cb.should.have.been.called
        expect(cb).to.have.been.calledOnce
      })
  })
})

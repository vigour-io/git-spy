var log = require('npmlog')
var config = require('../../config')
var githubApi = require('../../src/github-api')
var spy = require('../../src/spy')
var mocks = {
  hookshotData: require('../mocks/hookshot-result'),
  patterns: require('../mocks/patterns'),
  callbacks: require('../mocks/callbacks')
}

describe('matching hookshotData to subscriptions', function () {
  before(function (done) {
    githubApi.authenticate(config)
    githubApi.init()
      .then(function (resp) {
        log.info('githubApi initialized')
        done()
      })
      .catch(function (err) {
        log.warn('githubApi failed to initialize', err)
      })
  })

  beforeEach(function () {
    spy.clearSubscriptions()
  })

  it('hookData should match subscription with repo = *', function (done) {
    spy.on(mocks.patterns['all repos'], mocks.callbacks.one)
    spy.match(mocks.hookshotData)
      .then(function (res) {
        assert.equal(res.callbacks.length, 1)
        assert.equal(res.callbacks[0], mocks.callbacks.one)
      })
      .done(done)
  })

  it('should not match if not the same repo', function (done) {
    spy.on(mocks.patterns['two repos'], mocks.callbacks.one)
    spy.match(mocks.hookshotData)
      .then(function (res) {
        assert.equal(res.callbacks.length, 0)
      })
      .done(done)
  })

  it('should match if repo and branch', function (done) {
    spy.on(mocks.patterns['repo with branches'], mocks.callbacks.one)
    spy.match(mocks.hookshotData)
      .then(function (res) {
        assert.equal(res.callbacks.length, 1)
        assert.equal(res.callbacks[0], mocks.callbacks.one)
      })
      .done(done)
  })

  it('should match if repo and branch and files', function (done) {
    spy.on(mocks.patterns['branch with files'], mocks.callbacks.one)
    spy.match(mocks.hookshotData)
      .then(function (res) {
        assert.equal(res.callbacks.length, 1)
        assert.equal(res.callbacks[0], mocks.callbacks.one)
      })
      .done(done)
  })

  it('should match if repo and branch and files and fields', function (done) {
    spy.on(mocks.patterns['file with fields'], mocks.callbacks.one)
    spy.match(mocks.hookshotData)
      .then(function (res) {
        assert.equal(res.callbacks.length, 1)
        assert.equal(res.callbacks[0], mocks.callbacks.one)
      })
      .done(done)
  })
})

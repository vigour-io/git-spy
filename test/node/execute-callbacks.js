var log = require('npmlog')
  , config = require('../../config')
  , request = require('request')
  , spy = require('../../src/spy')
  , githubApi = require('../../src/github-api')
  , server = require('../../src/server')
  , serverURL = 'http://localhost:' + config.port
  , mocks = {
    patterns: require('../mocks/patterns'),
    hookshotData: require('../mocks/hookshot-result')
  };

describe('executing the callbacks', function(){

  before(function(done){
    githubApi.authenticate(config)
    githubApi.init()
      .then(function (resp) {
      log.info( 'githubApi initialized' );
      done();
    })
    .catch(function (err) {
      log.warn('githubApi failed to initialize', err)
    });
  });

  beforeEach(function(){
    spy.clearSubscriptions();
  });

  it('should execute callback for hookshotData', function(done){
    var diffs, callbacks;
    var hookshotData = mocks.hookshotData;
    var cb = sinon.spy();
    spy.on( mocks.patterns['file with fields'], cb );
    spy.match( hookshotData )
      .then(function(res){
        callbacks = res.callbacks;
        diffs = res.diffs;
        assert.equal( callbacks.length, 1 );
        assert.equal( callbacks[0], cb );
      })
      .then(function(){
        spy.executeCallbacks( callbacks, hookshotData, diffs );
      })
      .then(function(){
        // cb.should.have.been.called;
        expect(cb).to.have.been.called;
      })
      .done( done );
  });

  it('more than one match should only fire one callback', function(done){
    var diffs, callbacks;
    var hookshotData = mocks.hookshotData;
    var cb = sinon.spy();
    spy.on( mocks.patterns['file with fields'], cb );
    spy.on( mocks.patterns['all repos'], cb );
    spy.match( hookshotData )
      .then(function(res){
        callbacks = res.callbacks;
        diffs = res.diffs;
        assert.equal( callbacks.length, 1 );
        assert.equal( callbacks[0], cb );
      })
      .then(function(){
        spy.executeCallbacks( callbacks, hookshotData, diffs );
      })
      .then(function(){
        // cb.should.have.been.called;
        expect(cb).to.have.been.calledOnce;
      })
      .done( done );
  });

});

var log = require('npmlog')
  , config = require('../../config')
  , githubApi = require('../../src/github-api')
  , spy = require('../../src/spy')
  , mocks = {
    hookshotData: require('../mocks/hookshot-result'),
    patterns: require('../mocks/patterns'),
    callbacks: require('../mocks/callbacks')
  }
  , patterns;

describe('matching hookshotData to subscriptions', function(){

  before(function(done){
    githubApi.authenticate(config)
    githubApi.init(function (resp) {
      log.info( 'githubApi initialized' )
      done();
    }, function (err) {
      log.warn('githubApi failed to initialize', err)
    })
    spy.on( mocks.patterns['all repos'], mocks.callbacks.one );
    spy.on( mocks.patterns['two repos'], mocks.callbacks.two );
    spy.on( mocks.patterns['repo with branches'], mocks.callbacks.three );
    spy.on( mocks.patterns['branch with files'], mocks.callbacks.three );
    
  });

  it('hookData should match subscription with repo = *', function(){
    spy.match(mocks.hookshotData);
  });

});
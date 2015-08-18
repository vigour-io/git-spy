var spy = require('../../src/spy')
  , mocks = {
    hookshotData: require('../mocks/hookshot-result'),
    patterns: require('../mocks/patterns'),
    callbacks: require('../mocks/callbacks')
  }
  , patterns;

describe('matching hookshotData to subscriptions', function(){

  before(function(){
    spy.on( mocks.patterns['all repos'], mocks.callbacks.one );
    spy.on( mocks.patterns['two repos'], mocks.callbacks.two );
    spy.on( mocks.patterns['repo with branches'], mocks.callbacks.three );
    spy.on( mocks.patterns['branch with files'], mocks.callbacks.three );
    
  });

  it('hookData should match subscription with repo = *', function(){
    spy.match(mocks.hookshotData);
  });

});
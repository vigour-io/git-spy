var spy = require('../../src/spy')
  , mocks = {
    patterns: require('../mocks/patterns.json'),
    callbacks: require('../mocks/callbacks')
  }

describe('registering subscriptions', function(){

  beforeEach(function(){console.log('clearing subscriptions');
    spy.clearSubscriptions();
  });

  it('should register one pattern to one subscription', function(){
    spy.on(mocks.patterns['all repos'], mocks.callbacks.one );
    assert.equal(spy.subscriptions.length, 1);
    assert.equal(mocks.callbacks.one, spy.subscriptions[0].callback);
  });

  it('should register one double pattern to two subscriptions', function(){
    spy.on(mocks.patterns['two repos'], mocks.callbacks.two );
    assert.equal(spy.subscriptions.length, 2);
    assert.equal(mocks.callbacks.two, spy.subscriptions[0].callback);
    assert.equal(mocks.callbacks.two, spy.subscriptions[1].callback);
  });

  it('should register all patterns', function(){
    var expectedSubscriptions = 0;
    var patterns = mocks.patterns;
    var patternKeys = Object.keys(patterns);
    for(var i = 0, l = patternKeys.length; i < l; i++){
      var patternKey = patternKeys[i];
      var pattern = patterns[patternKey];
      expectedSubscriptions += Object.keys( pattern ).length;
      spy.on( pattern, mocks.callbacks.one );
    }
    assert.equal( spy.subscriptions.length, expectedSubscriptions );
  });

});
var spy = require('../../src/spy')
  , mocks = {
    patterns: require('../mocks/patterns.json'),
    callbacks: require('../mocks/callbacks')
  }

describe('registering subscriptions', function(){

  beforeEach(function(){
    spy.subscriptions.splice(0);    
  });

  it('should register one pattern to one subscription', function(){
    spy.on(mocks.patterns['all repos'], mocks.callbacks.one );
    assert.equal(spy.subscriptions.length, 1);
    assert.equal(mocks.callbacks.one, spy.subscriptions[0].callback);
  });

  it('should register one double pattern to one subscriptions', function(){
    spy.on(mocks.patterns['two repos'], mocks.callbacks.two );
    assert.equal(spy.subscriptions.length, 1);
    assert.equal(mocks.callbacks.two, spy.subscriptions[0].callback);
  });

  it('should register all patterns', function(){
    var patterns = mocks.patterns;
    var keys = Object.keys(patterns);
    for(var i = 0, l = keys.length; i < l; i++){
      var key = keys[i];
      var pattern = patterns[key];
      spy.on(pattern, mocks.callbacks.one);
    }
    assert.equal(keys.length, spy.subscriptions.length);
  });

});
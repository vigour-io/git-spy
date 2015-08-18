var spy = require('../../src/spy')
  , mocks = {
    hookshotData: require('../mocks/hookshot-result'),
    patterns: require('../mocks/patterns'),
    callbacks: require('../mocks/callbacks')
  }
  , patterns;

describe('matching hookshotData to subscriptions', function(){

  it('hookData should match subscription with repo = *', function(done){
    spy.match(mocks.hookshotData, mocks.patterns['all repos'])
      .then(function(matches){
        assert.ok(matches);
      })
      .done(done);
  });

});
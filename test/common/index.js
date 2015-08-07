var spy = require('../../src')
  , subscriptions = spy.subscriptions
  , callbacks = require('./callbacks')
  , patterns = require('./patterns')

describe('Git-Spy-POC', function(){

  describe('Registering Patterns', function(){
    before(function(){
      spy.on( patterns.pattern1, callbacks.one );
      spy.on( patterns.pattern2, callbacks.one );
      spy.on( patterns.pattern3, callbacks.two );
    });

    it('patterns should have 3 registrations', function(){
      assert.equal( Object.keys(subscriptions).length, 3 );
    });

    it('should be the same callback for patterns 1 and 2', function(){
      assert.equal( subscriptions[0].callback, subscriptions[1].callback );
    });
  });

  describe('Matching output to patterns', function(){
    it('should return 2 callbacks for this output comparing to the 3 patterns', function(done){
      spy.match(output, subscriptions)
        .then(function(callbacks){
          console.log('callbacks', callbacks);
          assert.equal(callbacks.length, 2);
        })
        .done(done);
    });
  });
});

var output = {
  "repoId": "mtv-play",
  "owner": "vigour-io",
  "branch": "master",
  "headCommitId": "ba7038c75d60682ab2872d7b542748def213d8d9",
  "before": "31d8f83742989af026cae686214c6e0984afa17a",
  "after": "ba7038c75d60682ab2872d7b542748def213d8d9",
  "files": ["package.json0", "package.json", "package.json2"],
  "commits": {
      "ba7038c75d60682ab2872d7b542748def213d8d90": {
          "files": ["package.json0"],
          "timestamp": "2015-08-03T15:31:19+02:00"
      },
      "ba7038c75d60682ab2872d7b542748def213d8d91": {
          "files": ["package.json"],
          "timestamp": "2015-08-03T15:31:19+02:00"
      },
      "ba7038c75d60682ab2872d7b542748def213d8d92": {
          "files": ["package.json2"],
          "timestamp": "2015-08-03T15:31:19+02:00"
      },
      "ba7038c75d60682ab2872d7b542748def213d8d93": {
          "files": ["package.json"],
          "timestamp": "2015-08-03T15:31:19+02:00"
      }
  }
};



var request = require('request')
  , server = require('../../src/server')
  , config = require('../../config');

describe('restify server', function(){

  after(function(){
    server.stop();
  })

  it('should start the server', function(done){
    server.start( config )
      .then(function(){
        assert.ok(server.running);
      })
      .done(done)
  });

  it('should handle 404s', function(done){
    var url = 'http://localhost:' + server.port + '/some-faulty-url'
    request(url, function(err, res, body){
      if(err){
        throw err;
      }
      assert.equal(res.statusCode, 404);
      done();
    });
  });

  it('should return 200 for post requests to /push', function(done){
    var url = 'http://localhost:' + server.port + '/push';
    request.post(url, function(err, res, body){
      if(err){
        throw err;
      }
      assert.equal(res.statusCode, 200);
      done();
    });
  });

});
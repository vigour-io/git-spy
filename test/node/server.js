var config = require('../../config')
  , request = require('request')
  , server = require('../../src/server')
  , serverURL = 'http://localhost:' + config.port
  , mocks = {
    hookshotData: require('../mocks/hookshot-data')
  };

describe('restify server', function(){

  before(function(done){
    server.start(config)
      .then(done);
  });

  after(function(){
    server.stop();
  });

  it('should start the server', function(){
    assert.ok(server.running);
  });

  it('should handle 404s', function(done){
    request.get(serverURL + '/some-faulty-url', function(err, res, body){
      if(err){
        throw err;
      }
      assert.ok(res.statusCode, 404);
      done();
    });
  });

  it('should return 200 for post requests to /push', function(done){
    var data = { json: mocks.hookshotData };
    request.post(serverURL + '/push', data, function(err, res, body){
      if(err){
        throw err;
      }
      assert.ok(res.statusCode, 404);
      done();
    });
  });

});
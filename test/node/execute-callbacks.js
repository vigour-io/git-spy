var log = require('npmlog')
  , config = require('../../config')
  , request = require('request')
  , spy = require('../../src/spy')
  , githubApi = require('../../src/github-api')
  , server = require('../../src/server')
  , serverURL = 'http://localhost:' + config.port
  , mocks = {
    patterns: require('../mocks/patterns'),
    hookshotData: require('../mocks/hookshot-data')
  };

describe('executing the callbacks', function(){

  // before(function(done){
  //   githubApi.authenticate(config)
  //   githubApi.init(function (resp) {
  //     log.info( 'githubApi initialized' )
  //     server.start(config)
  //     .then(done);
  //   }, function (err) {
  //     log.warn('githubApi failed to initialize', err)
  //   });
  // });

  // after(function(){
  //   server.stop();
  // });

  // beforeEach(function(){
  //   spy.clearSubscriptions();
  // });


  // //[TODO: learn how to write this tests]
  // it('should execute callback for hookshotData', function(done){
  //   this.timeout(5000)
  //   var callback = sinon.spy();
  //   spy.on( mocks.patterns['file with fields'], callback );
  //   var data = { json: mocks.hookshotData };
  //   request.post(serverURL + '/push', data, function(err, res, body){
  //     setTimeout(function(){
  //       expect(callback).to.have.been.called()
  //       done();
  //     }, 1500);
  //   });
  // });

});

var log = require('npmlog')
  , restify = require('restify')
  , express = require('express')
  , bodyParser = require('body-parser')
  , Promise = require('bluebird')
  , hookshotParser = require('../hookshot-manager').parseFromGithub
  , theServer

var Server = module.exports = {
  running: false,
  start: function connect(config){
    Server.port = config.port;
    return new Promise(function(fulfill, reject){
      theServer.listen(config.port, function(){
        Server.running = true;
        console.log('Listening for hookshots on port', Server.port);
        fulfill();
      })
    });
  },
  stop: function(){
    Server.running = false;
    theServer.close();
  }
};

theServer = restify.createServer({
  name: 'git-spy',
  version: '1.0.0'
});

theServer.use(restify.CORS());
theServer.use(restify.fullResponse());

theServer.post('/push', function(req, res){
  hookshotParser( req )
    .then(function(hookData){
      res.status(202);
      res.end('ACCEPTED');
    })
    .catch(function(err){
      console.log('err', err);
    })
});
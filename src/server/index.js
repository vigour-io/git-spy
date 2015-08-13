var log = require('npmlog')
  , restify = require('restify')
  , Promise = require('bluebird')
  // , hookListener = require('./hook-listener')

var restServer = restify.createServer({
  name: 'git-spy',
  version: '1.0.0'
});

var listen = Promise.promisify( restServer.listen );
restServer.use( restify.CORS() );
restServer.use( restify.fullResponse() );
restServer.post( '/push', pushHandler );
restServer.use( serveCode(404) );

var Server = module.exports = {
  running: false,
  start: function connect(config){
    Server.port = config.port;
    return new Promise(function(fulfill, reject){
      restServer.listen(Server.port, function(){
        Server.running = true;
        log.info("Listening for hookshots on port", Server.port);
        fulfill();
      });
    });
  },
  stop: function(){
    restServer.close();
  }
};


function pushHandler(req, res){
  res.send('something');
}

function serveCode (code) {
  return function (req, res) {
    res.status(code).end(code + " " + req.originalUrl)
  }
}
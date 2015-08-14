var log = require('npmlog')
  , express = require('express')
  , bodyParser = require('body-parser')
  , Promise = require('bluebird')
  , pushHandler = require('./push-handler')
  , theServer

var app = express();
app.use( bodyParser.json() );
app.post( '/push', pushHandler );
app.use( handle404 );

var Server = module.exports = {
  running: false,
  start: function connect(config){
    Server.port = config.port;
    return new Promise(function(fulfill, reject){
      theServer = app.listen(Server.port, function(){
        Server.running = true;
        log.info("Listening for hookshots on port", Server.port);
        fulfill();
      });
    });
  },
  stop: function(){
    theServer.close();
  }
};

function handle404(req, res){
  res.sendStatus(404);
};
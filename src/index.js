
var log = require('npmlog')
  , config = require('../config')
  , spy = require('./spy')
  , server = require('./server')
  , githubAPI = require('./github-api');

module.exports = spy;

server.start( config )
  .then(function(){
    log.info('git-spy', 'success!!!')
  })
  .catch(function(err){
    log.error('git-spy', 'failure to start', err)
  });
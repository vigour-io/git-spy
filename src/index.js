
var log = require('npmlog')
  , config = require('../config')
  , spy = require('./spy')
  , server = require('./server')
  , githubApi = require('./github-api');

module.exports = spy;

githubApi.authenticate(config);
githubApi.init()
  .then(function (resp) {
    log.info( 'githubApi initialized' )
  })
  .catch(function (err) {
    log.warn('githubApi failed to initialize', err)
  });

server.start( config )
  .then(function(){
    log.info('git-spy', 'success!!!')
  })
  .catch(function(err){
    log.error('git-spy', 'failure to start', err)
  });
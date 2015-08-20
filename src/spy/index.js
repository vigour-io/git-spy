var matchSubscriptions = require( './match-subscriptions' )
  , fetchDiffs = require('./fetch-diffs')
  , subscriptions = [];



var spy = module.exports = {
  subscriptions: subscriptions,
  match: function(hookshotData){
    var diffs;
    return fetchDiffs( hookshotData )
      .then(function(ds){
        diffs = ds;
      })
      .then(function(){
        return matchSubscriptions( hookshotData, diffs );
      })
      .then(function(callbacks){
        return {
          callbacks: callbacks,
          diffs: diffs
        };
      });
  },

  on: function(pattern, callback){
    pattern.callback = callback;
    subscriptions.push(pattern);
  },

  clearSubscriptions: function(){
    spy.subscriptions.splice(0, spy.subscriptions.length);
  },

  executeCallbacks: function(callbacks, hookshotData, diffs){
    for(var i = 0, l = callbacks.length; i < l; i++){
      callbacks[i](hookshotData, diffs);
    }
  }
};



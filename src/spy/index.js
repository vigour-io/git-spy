var matchSubscriptions = require( './match-subscriptions' )
  , subscriptions = [];



var spy = module.exports = {
  subscriptions: subscriptions,
  match: matchSubscriptions,
  on: function(pattern, callback){
    pattern.callback = callback;
    subscriptions.push(pattern);
  },
  clearSubscriptions: function(){
    spy.subscriptions.splice(0, spy.subscriptions.length);
  }
};

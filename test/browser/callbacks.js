

var callbacks = module.exports = {
  one: function one(hookShotData, diff){
    console.log('ONE fired');
    console.log('hookShotData', hookShotData);
    console.log('diff', diff);
    console.log('------------------------------------\n');
  },

  two: function two(hookShotData, diff){
    console.log('TWO fired');
    console.log('hookShotData', hookShotData);
    console.log('diff', diff);
    console.log('------------------------------------\n');
  },

  three: function three(hookShotData, diff){
    console.log('THREE fired');
    console.log('hookShotData', hookShotData);
    console.log('diff', diff);
    console.log('------------------------------------\n');
  }
};
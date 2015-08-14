var fs = require('fs')
  , path = require('path')
  , parseFromGithub = require('../../src/hookshot-manager').parseFromGithub;

describe('hookshot-parser', function(){
  it('should return the expected result', function(done){
    var expectedResult = require('../mocks/hookshot-result.json');
    var dataPath = path.join( __dirname, '../mocks/hookshot-data.json');
    var rStream = fs.createReadStream( dataPath );
    parseFromGithub( rStream )
      .then(function(hookData){
        assert.deepEqual(hookData, expectedResult);
      })
      .done( done );
  })
});
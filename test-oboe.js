var path = require('path')
  , fs = require('fs')
  , oboe = require('oboe')

var jsonPath = path.join(__dirname, 'test/mocks/hookshot-data.json')
oboe( fs.createReadStream(jsonPath) )
  .node('before', function(b){
    console.log(b);
  });


var json = require(jsonPath);

console.log(JSON.stringify(json))
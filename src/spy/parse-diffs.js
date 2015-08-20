var _ = require('lodash')

module.exports = function diff (before, after) {
  var fixedSchemas = fixSchema(before, after)
  return parseDiff(fixedSchemas.before, fixedSchemas.after)
}

function fixSchema (bef, aft) {
  var before = _.extend(bef, {})
    , after = _.extend(aft, {})

  fix(before, after)
  fix(after, before)

  return {
    before: before,
    after:  after
  }
}

function fix (subject, model) {
  _.each(model, function (modelValue, modelKey) {

    if( subject[modelKey] === modelValue ){
      return;
    }

    if( _.isNull(subject[modelKey]) ){
      return;
    }

    if( _.isUndefined(subject[modelKey]) ){
      return subject[modelKey] = null;
    } 

    if( _.isObject(modelValue) ){
      return fix(subject[modelKey], modelValue);
    }
  })
}


function parseDiff (before, after) {
  var difference = {}
  _.each(after, function (value, key) {
    if( _.isEqual(before[key], value) ) {
      return;
    }

    if( _.isNull(before[key]) ){
      return difference[key] = value;
    }

    difference[key] = _.isObject(value) ? parseDiff(before[key], value) : value
  });
  
  return difference;
}



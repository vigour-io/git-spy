var _ = require('lodash')

module.exports = function diff (before, after) {
  var fixedSchemas = fixSchema(before, after)
  var parsedDiff = parseDiff(fixedSchemas.before, fixedSchemas.after)
  parsedDiff.$before = before
  parsedDiff.$after = after
  return parsedDiff
}

function fixSchema (bef, aft) {
  var before = _.extend(bef, {})
  var after = _.extend(aft, {})

  fix(before, after)
  fix(after, before)

  return {
    before: before,
    after: after
  }
}

function fix (subject, model) {
  _.each(model, function (modelValue, modelKey) {
    if (subject[modelKey] === modelValue) {
      return
    }

    if (_.isNull(subject[modelKey])) {
      return
    }

    if (_.isUndefined(subject[modelKey])) {
      subject[modelKey] = null
      return subject[modelKey]
    }

    if (_.isObject(modelValue)) {
      return fix(subject[modelKey], modelValue)
    }
  })
}

function parseDiff (before, after) {
  var difference = {}
  _.each(after, function (value, key) {
    if (_.isEqual(before[key], value)) {
      return
    }

    if (_.isNull(before[key])) {
      difference[key] = value
      return difference[key]
    }

    difference[key] = _.isObject(value) ? parseDiff(before[key], value) : value
  })

  return difference
}

var _       = require('lodash'),
    path    = require('path'),
    lowdb   = require('lowdb'),
    log     = require('./logging')

module.exports = function(conf) {

  var dbs = _.reduce(conf.dataFiles, function(dbs, dataFile, dataFileKey) {
    return _.set(dbs, dataFileKey, lowdb(path.resolve(__dirname) + '/' + dataFile))
  }, {})

  this.addEntry = function(data) {
    _.forEach(dbs, function(db) {
      var entry = _.merge({}, data, {
        timestamp: new Date().toISOString()
      })
      db('data').push(entry)
    })
  }

  this.collection = function(key) {
    return _.get(dbs, key, { data: [] })
  }

}
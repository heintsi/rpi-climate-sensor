var _merge = require('lodash.merge'),
    path = require('path'),
    lowdb  = require('lowdb')

module.exports = new function() {

  var db = lowdb(path.resolve(__dirname) + '/data.json')

  var collectionKey = 'data'
  db(collectionKey)

  this.add = function(data) {
    var entry = _merge({}, data, {
        timestamp: new Date().getTime()
      }
    )
    db.object[collectionKey].push(entry)
    db.save()
  }

}
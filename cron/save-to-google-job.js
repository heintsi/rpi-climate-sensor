// TODO Find entries in google data file and try to post to specified Google sheets doc

var _       = require('lodash'),
    CronJob = require('cron').CronJob,
    request = require('request'),
    log     = require('../logging')

module.exports = SaveToGoogleJob

function SaveToGoogleJob(conf) {

  var job = new CronJob(conf.cronPattern, tick, function() {
    log.info('STOPPED SaveToGoogleJob')
  }, false)

  function tick() {
    var dataCollection = conf.db.collection(conf.dataFileKey)('data')
    var entry          = dataCollection.take(1)[0]

    if (!entry) {
      log.debug('Google data buffer empty, skipping data post.')
    }
    else {
      // TODO Handle emptying buffer if size happens to be >1 (e.g. internet down)

      var data                            = {}
      data[conf.keys.timestamp]           = _.get(entry, 'timestamp')
      data[conf.keys.indoor.temperature]  = _.get(entry, 'indoor.temperature')
      data[conf.keys.indoor.humidity]     = _.get(entry, 'indoor.humidity')
      data[conf.keys.outdoor.temperature] = _.get(entry, 'outdoor.temperature')
      data[conf.keys.outdoor.humidity]    = _.get(entry, 'outdoor.humidity')

      request({
        url:    conf.url,
        method: 'POST',
        form:   data
      }, function(err, res, body) {
        if (!err && res.statusCode == 200) {
          dataCollection.pullAt(0)
          log.debug('Google data post successful. Data buffer size after post: %d', dataCollection.size())
        } else {
          log.notice('Failed to log results to Google. ' + err)
        }
      })

    }
  }

  this.start = function() {
    log.info('START SaveToGoogleJob with pattern %s', job.cronTime.source)
    job.start()
  }

  this.stop = function() {
    log.info('STOP SaveToGoogleJob')
    job.stop()
  }

}
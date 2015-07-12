// TODO Read values from specified sensors and write them to specified data files

var _       = require('lodash'),
    CronJob = require('cron').CronJob,
    log     = require('../logging')

module.exports = ReadSensorJob

function ReadSensorJob(conf) {

  var job = new CronJob(conf.cronPattern, tick, function() {
    log.info('STOPPED ReadSensorJob')
  }, false)

  function tick() {
    var values = _.reduce(conf.sensors, readValues, {})
    log.measurement('Measured values from %d sensors: %s', _.size(_.keys(values)), formatValuesForLog(values))
    conf.db.addEntry(values)

    function readValues(values, sensor) {
      var readOut = conf.dhtSensor.readSpec(sensor.type, sensor.pin)
      return _.set(values, sensor.name, {
        temperature: readOut.temperature.toFixed(1),
        humidity: readOut.humidity.toFixed(1)
      })
    }

    function formatValuesForLog(measurements) {
      return '[ ' + _.map(measurements, function(measurement, sensorName) {
        return sensorName + ': ' + measurement.temperature + 'C, ' + measurement.humidity + '%'
      }).join(' | ') + ' ]'
    }
  }

  this.start = function() {
    log.info('START ReadSensorJob with pattern %s', job.cronTime.source)
    job.start()
  }

  this.stop = function() {
    log.info('STOP ReadSensorJob')
    job.stop()
  }

}
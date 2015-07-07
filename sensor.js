var db     = require('./db'),
    config = require('./config'),
    log    = require('./logging')

log.info('Starting up sensor logging script...')

var dhtSensor = config.dhtSensor

var sensor = {
  sensors: [{
    name: "indoor",
    type: 22,
    pin:  3
  }, {
    name: "outdoor",
    type: 22,
    pin:  4
  }],

  read: function() {
    var reads = {}
    for (var i in this.sensors) {
      var readOut = dhtSensor.readSpec(this.sensors[i].type, this.sensors[i].pin)
      var sensorName = this.sensors[i].name
      reads[sensorName] = {
        temperature: readOut.temperature.toFixed(1),
        humidity:    readOut.humidity.toFixed(1)
      }
      log.measurement('Measured values from sensor "%s": %dC %d%', sensorName, readOut.temperature.toFixed(1), readOut.humidity.toFixed(1))
    }
    db.add(reads)

    setTimeout(function() {
      sensor.read()
    }, config.pollingFrequencySecs)
  }
}

log.info('Starting sensor logging with interval of %d seconds.', config.pollingFrequencySecs / 1000)

sensor.read()
var _    = require('lodash'),
    conf = require('./config')

var env = process.env.NODE_ENV || 'prod'

var configuration = {

  // The dev mode allows to test and run the app, but the actual DHT sensor interface is mocked.
  dev: function() {
    return {
      sensorJob: {
        dhtSensor: {
          readSpec: function() {
            return {
              temperature: 0,
              humidity: 0
            }
          }
        },
        cronPattern: '0,20,40 * * * * *' // Override for testing, every 20 seconds
      },
      googleSheetJob: {
        cronPattern: '5,15,25,35,45,55 * * * * *'
      }
    }
  },

  prod: function() {
    return {
      sensorJob: {
        dhtSensor: require('node-dht-sensor')
      }
    }

  }
}

module.exports = _.merge({}, conf, configuration[env]())
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
        cronPattern: '0,15,30,45 * * * * *' // Override for testing, every 15 seconds
      },
      googleSheetJob: {
        cronPattern: '5,20,35,50 * * * * *'
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
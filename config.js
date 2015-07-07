var env = process.env.NODE_ENV || 'prod'

var configuration = {

  // The dev mode allows to test and run the app, but the actual DHT sensor interface is mocked.
  dev: function() {
    return {
      dhtSensor: {
        readSpec: function() {
          return {
            temperature: 0,
            humidity: 0
          }
        }
      },
      pollingFrequencySecs: 1000 * 10 // 10 seconds
    }
  },

  prod: function() {
    return {
      dhtSensor: require('node-dht-sensor'),
      pollingFrequencySecs: 1000 * 60 * 15 // 15 minutes
    }

  }
}

module.exports = configuration[env]()
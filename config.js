module.exports = {


  sensorJob: {

    // Job scheduling pattern for reading sensor values.
    cronPattern: '0 0,15,30,45 * * * *', // == Every 15 minutes starting every new hour at hh:00

    // A list of the sensors to read from.
    sensors: [
      {
        name: 'indoor', // This must be unique within the list.
        type: 22,       // 11 for DHT11, 22 for DHT22 and AM2302
        pin:  3         // The number of the pin the sensor is connected to in RPI
      },
      {
        name: 'outdoor',
        type: 22,
        pin:  4
      }
    ],

    // Files to write the sensor data.
    dataFiles: {
      main: 'data.json',
      google: 'data-google.json'
    }
  },


  googleSheetJob: {

    cronPattern: '0 1,6,11,16,21,26,31,36,41,46,51,56 * * * *', // == Every 5 minutes starting every new hour at hh:01

    dataFileKey: 'google',

    url: '', // Google sheet url

    keys: {
      timestamp: '',
      indoor: {
        temperature: '',
        humidity: ''
      },
      outdoor: {
        temperature: '',
        humidity: ''
      }
    }
  }

}
var winston = require('winston')

winston.addColors({
  debug: 'magenta',
  measurement: 'blue',
  info: 'green',
  notice: 'yellow'

})

module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      name:  'console',
      level: 'debug',
      colorize: true
    }),
    new (winston.transports.File)({
      name:     'info-file',
      filename: 'sensor.log',
      level:    'debug'
    })
  ],
  levels: {
    debug: 0,
    measurement: 1,
    info: 2,
    notice: 3
  }

})



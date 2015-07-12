var _             = require('lodash'),
    env           = require('./env'),
    log           = require('./logging'),
    DB            = require('./db'),
    ReadSensorJob = require('./cron/read-sensor-job'),
    SaveToGoogleJob = require('./cron/save-to-google-job')

log.info('Starting up sensor logging script...')

var db = new DB(env.sensorJob)

var jobs = _.map([
    new ReadSensorJob(_.merge({}, env.sensorJob, { db: db }))
   ,new SaveToGoogleJob(_.merge({}, env.googleSheetJob, { db: db }))
])

startJobs(jobs)

function startJobs(jobs) {
  _.forEach(jobs, function(job) {
    job.start()
  })
}
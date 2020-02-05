<<<<<<< HEAD
module.exports = {
  Queues: require('./queue/queues'),
  Actions: require('./action/actions'),
  Parsers: require('./parser/parsers'),
  QueueManager: require('./queue_manager/actions'),
  Job: require('./Job').AbstractJob,
  Condition: require('./Condition').Condition
}
=======
module.exports.Queues = require('./queue/queues')
module.exports.Actions = require('./action/actions')
module.exports.Job = require('./Job').AbstractJob
module.exports.Condition = require('./Condition').Condition
module.exports.QueueManager = require('./queue_manager/actions')
module.exports.Parsers = require('./parser/parsers')
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend

const QueueAction = require('./GenericStartAction').GenericStartAction
const LegislativeActivityFetchJob = require('../../../job/LegislativeActivityFetchJob').LegislativeActivityFetchJob

class LegislativeActivityStart extends QueueAction {
  constructor (manager) {
    super(manager, LegislativeActivityFetchJob)
  }
}

module.exports.LegislativeActivityStart = LegislativeActivityStart

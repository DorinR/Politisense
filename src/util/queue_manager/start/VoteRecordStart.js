const QueueAction = require('./GenericStartAction').GenericStartAction
const VoteRecordFetchJob = require('@jobs').VoteRecordFetchJob

class VoteRecordStart extends QueueAction {
  constructor (manager) {
    super(manager, VoteRecordFetchJob)
  }
}

module.exports.VoteRecordStart = VoteRecordStart

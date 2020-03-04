const QueueAction = require('./GenericStartAction').GenericStartAction
const VoteParticipantFetchJob = require('@jobs').VoteParticipantFetchJob

class VoteParticipantStart extends QueueAction {
  constructor (manager) {
    super(manager, VoteParticipantFetchJob)
  }
}

module.exports.VoteParticipantStart = VoteParticipantStart

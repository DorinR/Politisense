const QueueAction = require('@manager').QueueAction
const VoteParticipantFetchJob = require('@jobs').VoteParticipantFetchJob

class VoteParticipantStart extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
  }

  perform () {
    this.manager.queryCount = this.manager.params.length
    const first = VoteParticipantFetchJob.create(
      this.manager.params.shift(),
      this.manager.requeueCallback.bind(this.manager)
    )
    this.manager.params.forEach(param => {
      this.manager.queue.enqueue(
        VoteParticipantFetchJob.create(
          param,
          this.manager.requeueCallback.bind(this.manager)
        )
      )
    })
    return first.execute()
  }
}

module.exports.VoteParticipantStart = VoteParticipantStart
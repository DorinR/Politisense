const QueueAction = require('../QueueAction').QueueAction
const VoteRecordFetchJob = require('@jobs').VoteRecordFetchJob

class VoteRecordStart extends QueueAction {
  constructor (manager) {
    super()
    manager.queryCount = manager.params.length
    this.first = VoteRecordFetchJob.create(
      manager.params.shift(),
      manager.requeueCallback.bind(manager)
    )
    manager.params.forEach(param => {
      manager.queue.enqueue(
        VoteRecordFetchJob.create(
          param,
          manager.requeueCallback.bind(manager)
        )
      )
    })
  }

  perform () {
    return this.first.execute()
  }
}

module.exports.VoteRecordStart = VoteRecordStart

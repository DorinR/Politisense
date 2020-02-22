const QueueActions = require('../actions')
const QueueAction = QueueActions.QueueAction
const VoteFetchJob = require('../../../job/jobs').VoteFetchJob

class VoteStart extends QueueAction {
  constructor (manager) {
    super()
    this.first = VoteFetchJob.create(
      manager.params.shift(),
      manager.requeueCallback.bind(manager)
    )
    manager.params.forEach(param => {
      manager.queue.enqueue(
        VoteFetchJob.create(
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

module.exports.VoteStart = VoteStart

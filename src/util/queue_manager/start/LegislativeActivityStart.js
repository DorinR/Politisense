const QueueAction = require('../QueueAction').QueueAction
const LegislativeActivityFetchJob = require('../../../job/LegislativeActivityFetchJob').LegislativeActivityFetchJob

class LegislativeActivityStart extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
  }

  async perform () {
    this.manager.params.forEach(param => {
      this.manager.queue.enqueue(
        LegislativeActivityFetchJob.create(
          param,
          this.manager.requeueCallback.bind(this.manager)
        )
      )
    })
  }
}

module.exports.LegislativeActivityStart = LegislativeActivityStart

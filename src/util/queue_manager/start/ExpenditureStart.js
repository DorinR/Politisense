const QueueAction = require('../QueueAction').QueueAction
const ExpenditureFetchJob = require('@jobs').ExpenditureFetchJob

class ExpenditureStartAction extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
  }

  async perform () {
    this.manager.params.forEach(param => {
      this.manager.queue.enqueue(
        ExpenditureFetchJob.create(
          param,
          this.manager.requeueCallback.bind(this.manager)
        )
      )
    })
  }
}

module.exports.ExpenditureStartAction = ExpenditureStartAction

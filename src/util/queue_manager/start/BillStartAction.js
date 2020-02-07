const QueueActions = require('../actions')
const QueueAction = QueueActions.QueueAction
const BillFetchJob = require('../../../job/jobs').BillFetchJob

class BillStartAction extends QueueAction {
  constructor (manager) {
    super()
    this.first = BillFetchJob.create(
      manager.params.shift(),
      manager.requeueCallback.bind(manager)
    )
    manager.params.forEach(param => {
      manager.queue.enqueue(
        BillFetchJob.create(
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

module.exports.BillStartAction = BillStartAction
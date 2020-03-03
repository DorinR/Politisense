const QueueAction = require('../QueueAction').QueueAction
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
    try {
      return this.first.execute()
    } catch (e) {
      return {
        params: this.first.params,
        data: []
      }
    }
  }
}

module.exports.BillStartAction = BillStartAction

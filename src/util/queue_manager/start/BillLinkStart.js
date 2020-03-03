const QueueAction = require('../QueueAction').QueueAction
const BillPDFFinderJob = require('../../../job/BillLinkFetchJob').BillLinkFetchJob

class BillLinkStart extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
  }

  async perform () {
    this.manager.params.forEach(param => {
      this.manager.queue.enqueue(
        BillPDFFinderJob.create(
          param,
          this.manager.requeueCallback.bind(this.manager)
        )
      )
    })
  }
}

module.exports.BillLinkStart = BillLinkStart

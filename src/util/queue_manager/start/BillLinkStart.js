const QueueActions = require('../actions')
const QueueAction = QueueActions.QueueAction
const BillPDFFinderJob = require('../../../job/BillLinkFetchJob').BillLinkFetchJob

class BillLinkStart extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
  }

  perform () {
    const first = BillPDFFinderJob.create(
      this.manager.params.shift(),
      this.manager.requeueCallback.bind(this.manager)
    )
    this.manager.params.forEach(param => {
      this.manager.queue.enqueue(
        BillPDFFinderJob.create(
          param,
          this.manager.requeueCallback.bind(this.manager)
        )
      )
    })
    return first.execute()
  }
}

module.exports.BillLinkStart = BillLinkStart

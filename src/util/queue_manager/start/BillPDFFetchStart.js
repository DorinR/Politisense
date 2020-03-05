const QueueActions = require('../actions')
const QueueAction = QueueActions.QueueAction
const BillPDFFetchJob = require('../../../job/BillPDFFetchJob').PDFRetrievalJob

class BillPDFFetchStartAction extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
  }

  async perform () {
    this.manager.params.forEach(param => {
      this.manager.queue.enqueue(
        BillPDFFetchJob.create(
          param,
          this.manager.requeueCallback.bind(this.manager)
        )
      )
    })
  }
}

module.exports.BillPDFFetchStartAction = BillPDFFetchStartAction

const QueueAction = require('./GenericStartAction').GenericStartAction
const BillPDFFetchJob = require('../../../job/BillPDFFetchJob').PDFRetrievalJob

class BillPDFFetchStartAction extends QueueAction {
  constructor (manager) {
    super(manager, BillPDFFetchJob)
  }
}

module.exports.BillPDFFetchStartAction = BillPDFFetchStartAction

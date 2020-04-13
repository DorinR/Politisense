const QueueAction = require('./GenericStartAction').GenericStartAction
const BillPDFFinderJob = require('../../../job/BillLinkFetchJob').BillLinkFetchJob

class BillLinkStart extends QueueAction {
  constructor (manager) {
    super(manager, BillPDFFinderJob)
  }
}

module.exports.BillLinkStart = BillLinkStart

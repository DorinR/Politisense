const QueueAction = require('./GenericStartAction').GenericStartAction
const BillFetchJob = require('../../../job/jobs').BillFetchJob

class BillStartAction extends QueueAction {
  constructor (manager) {
    super(manager, BillFetchJob)
  }
}

module.exports.BillStartAction = BillStartAction

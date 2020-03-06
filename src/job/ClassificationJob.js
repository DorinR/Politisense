const QueueManagerWrapperAction = require('../util/action/wrapper_action/QueueManagerWrapperAction').QueueManagerWrapperAction
const ClassificationAction = require('../util/action/classify_action/BillClassifyAction').BillClassificationAction
const BillPDFFetchRunner = require('../data/runner/BillPDFFetchRunner').BillPDFFetchRunner
const BillLinkFetchRunner = require('../data/runner/BillLinkFetchRunner').BillLinkFetchRunner
const AbstractJob = require('./Job').AbstractJob
const FormatAction = require('../util/action/adapter_action/QueryResponseAdapterAction').QueryResponseAdapterAction

class ClassificationJob extends AbstractJob {
  constructor (params, callback) {
    super(params, callback)
    this.params = params
  }

  static create (params, cb) {
    const job = new ClassificationJob(params, cb)
    job
      .addAction(new QueueManagerWrapperAction(BillLinkFetchRunner, params))
      .addAction(new QueueManagerWrapperAction(BillPDFFetchRunner))
      .addAction(new ClassificationAction())
      .addAction(new FormatAction(params))
    return job
  }
}

module.exports.ClassificationJob = ClassificationJob

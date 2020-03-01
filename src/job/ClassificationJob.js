const QueueManagerWrapperAction = require('../util/action/QueueManagerWrapperAction').QueueManagerWrapperAction
const ClassificationAction = require('../util/action/classify_action/ClassifyAction').ClassificationAction
const Action = require('../util/action/JobAction').AbstractJobAction
const BillPDFFetchRunner = require('../data/runner/BillPDFFetchRunner').BillPDFFetchRunner
const BillLinkFetchRunner = require('../data/runner/BillLinkFetchRunner').BillLinkFetchRunner
const AbstractJob = require('../util/Job').AbstractJob

class FormatAction extends Action {
  perform(result){
    console.log(result)
    return result
  }
}

class ClassificationJob extends AbstractJob {
  constructor (params, callback) {
    super('', callback)
    this.params = params
  }

  static create(params, cb) {
    const job = new ClassificationJob(params, cb)
    job
      .addAction(new QueueManagerWrapperAction(BillLinkFetchRunner, params))
      .addAction(new QueueManagerWrapperAction(BillPDFFetchRunner))
      .addAction(new ClassificationAction())
      //.addAction(new FormatAction())
      //.addErrorAction(new Actions.HandleClassificationErrorAction())
    return job
  }
}

module.exports.ClassificationJob = ClassificationJob
const Job = require('./Job').AbstractJob
const Actions = require('@action')

class CategoryGenerationJob extends Job {
  constructor (params, cb) {
    super(params, cb)
    this.params = params
  }

  static create (params, cb) {
    return new CategoryGenerationJob(params, cb)
      .addAction(new Actions.BillTagCreationAction(params.parliament))
      .addAction(new Actions.QueryResponseAdapterAction(params))
  }
}

module.exports.CategoryGenerationJob = CategoryGenerationJob

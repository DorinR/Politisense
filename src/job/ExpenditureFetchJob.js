const Actions = require('@action')
const AbstractJob = require('../util/Job').AbstractJob
const ExpenditureParser = require('@parser').FinancialRecordXmlParser

class FormatAction extends Actions.Action {
  constructor (params) {
    super()
    this.params = params
  }

  async perform (result) {
    return {
      params: this.params,
      data: result
    }
  }
}

class ExpenditureFetchJob extends AbstractJob {
  static create(params, cb) {
    const job = new ExpenditureFetchJob(params, cb)
    job
      .addAction(new Actions.FetchAction(params))
      .addAction(new Actions.ParserWrapperAction(ExpenditureParser))
      .addAction(new FormatAction(params))
      .addErrorAction(new Actions.HandleConnectionErrorAction(cb, ExpenditureFetchJob.create, params))
    return job
  }

  constructor (params, cb) {
    super('', cb)
    this.params = params
  }
}

module.exports = {
  ExpenditureFetchJob: ExpenditureFetchJob
}


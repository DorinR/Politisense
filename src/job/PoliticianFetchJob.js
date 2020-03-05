const Job = require('../util/Job').AbstractJob
const Actions = require('@action')
const FetchAction = Actions.FetchAction
const ErrorHandler = Actions.HandleConnectionErrorAction
const ParserAction = Actions.ParserWrapperAction
const FormatAction = Actions.QueryResponseAdapterAction
const PoliticianParser = require('@parser').MpXmlParser

class PoliticianFetchJob extends Job {
  constructor (params, cb) {
    super(params, cb)
    this.params = params
  }

  static create (params, cb) {
    const job = new PoliticianFetchJob(params, cb)
    job
      .addAction(new FetchAction(params))
      .addAction(new ParserAction(PoliticianParser))
      .addAction(new FormatAction(params))
      .addErrorAction(new ErrorHandler(cb, PoliticianFetchJob.create, []))
    job.params = params
    return job
  }
}

module.exports.PoliticianFetchJob = PoliticianFetchJob

const Job = require('../util/Job').AbstractJob
const Actions = require('@action')
const FetchAction = Actions.FetchAction
const ErrorHandler = Actions.HandleConnectionErrorAction
const ParserAction = Actions.ParserWrapperAction
const FormatAction = Actions.FormatAction
const PoliticianParser = require('@parser').MpXmlParser

class PoliticianFetchJob extends Job {
  // eslint-disable-next-line no-useless-constructor
  constructor (params, cb) {
    super(params.url, cb)
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

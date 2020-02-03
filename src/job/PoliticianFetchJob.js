const utils = require('../util/utils')
const Job = require('../util/Job').AbstractJob
const Actions = utils.Actions
const FetchAction = Actions.FetchAction
const ErrorHandler = Actions.HandleConnectionErrorAction
const ParserAction = Actions.ParserWrapperAction
const PoliticianParser = utils.Parsers.PoliticianParser

class PoliticianFetchJob extends Job {
  // eslint-disable-next-line no-useless-constructor
  constructor (params, cb) {
    super(params.url, cb)
    this.params = params
  }

  static create (params, cb) {
    return new PoliticianFetchJob(params, cb)
      .addAction(new FetchAction(params))
      .addAction(new ParserAction(PoliticianParser))
      .addErrorAction(new ErrorHandler(cb, PoliticianFetchJob.create, []))
  }
}

module.exports.PoliticianFetchJob = PoliticianFetchJob

const Job = require('../util/Job').AbstractJob
const Actions = require('@action')
const FetchAction = Actions.FetchAction
const ErrorHandler = Actions.HandleConnectionErrorAction
const ParserAction = Actions.ParserWrapperAction
const VoteParser = require('@parser').VoteXmlParser

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

class VoteFetchJob extends Job {
  constructor (params, cb) {
    super(params.url, cb)
    this.params = params
  }

  static create (params, cb) {
    const job = new VoteFetchJob(params, cb)
    job
      .addAction(new FetchAction(params))
      .addAction(new ParserAction(VoteParser))
      .addAction(new FormatAction(params))
      .addErrorAction(new ErrorHandler(cb, VoteParser.create, []))
    job.params = params
    return job
  }
}

module.exports.VoteFetchJob = VoteFetchJob

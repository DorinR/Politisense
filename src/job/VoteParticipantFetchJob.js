const Job = require('./Job').AbstractJob
const Actions = require('@action')
const Parsers = require('@parser')

class VoteParticipantFetchJob extends Job {
  static create (params, cb) {
    return new VoteParticipantFetchJob(params, cb)
      .addAction(new Actions.FetchAction(Job.createRequestParams(params)))
      .addAction(new Actions.ParserWrapperAction(Parsers.VoteParticipantsXmlParser, { id: params.id }))
      .addAction(new Actions.QueryResponseAdapterAction(params))
      .addErrorAction(new Actions.HandleConnectionErrorAction(cb, VoteParticipantFetchJob.create, params))
  }

  constructor (params, cb) {
    super(params, cb)
    this.params = params
  }
}

module.exports.VoteParticipantFetchJob = VoteParticipantFetchJob

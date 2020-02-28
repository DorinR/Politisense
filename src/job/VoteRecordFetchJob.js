const Job = require('../util/Job').AbstractJob
const Actions = require('@action')
const Parsers = require('@parser')

class VoteRecordFetchJob extends Job {
  static create(params, cb) {
    return new VoteRecordFetchJob(params, cb)
      .addAction(new Actions.FetchAction(params))
      .addAction(new Actions.ParserWrapperAction(Parsers.VoteXmlParser))
      .addAction(new Actions.FormatAction(params))
      .addErrorAction(new Actions.HandleConnectionErrorAction(cb, VoteRecordFetchJob.create, []))
  }

  constructor (params, cb) {
    super(params.url, cb)
    this.params = params
  }
}

module.exports.VoteRecordFetchJob = VoteRecordFetchJob
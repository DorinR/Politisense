const Job = require('./Job').AbstractJob
const Actions = require('@action')
const LegislativeActivityXmlParser = require('@parser').LegislativeActivityXmlParser

class LegislativeActivityFetchJob extends Job {
  constructor(params, callback) {
    super(params.url, callback)
    this.params = params
  }

  static create(params, cb) {
    return new LegislativeActivityFetchJob(params, cb)
      .addAction(new Actions.FetchAction(params))
      .addAction(new Actions.ParserWrapperAction(LegislativeActivityXmlParser))
      .addAction(new Actions.QueryResponseAdapterAction({ type: 'rss-feed' }))
      .addErrorAction(new Actions.HandleConnectionErrorAction(cb, LegislativeActivityFetchJob.create, params))
  }
}

module.exports = {
  LegislativeActivityFetchJob: LegislativeActivityFetchJob
}

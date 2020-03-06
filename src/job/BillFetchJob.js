const Job = require('./Job').AbstractJob
const Actions = require('@action')
const BillParser = require('@parser').BillXmlParser

class BillFetchJob extends Job {
  static create (params, callback) {
    return new BillFetchJob(params, callback)
      .addAction(new Actions.FetchAction({
        url: params.url // cannot pass other params or the server spergs out and returns garbage
      }))
      .addAction(new Actions.ParserWrapperAction(BillParser))
      .addAction(new Actions.QueryResponseAdapterAction(params))
      .addErrorAction(new Actions.HandleConnectionErrorAction(callback, BillFetchJob.create, []))
  }
}

module.exports.BillFetchJob = BillFetchJob

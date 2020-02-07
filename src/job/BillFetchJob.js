const Job = require('../util/Job').AbstractJob
const Actions = require('@action')
const BillParser = require('@parser').BillXmlParser

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

class BillFetchJob extends Job {
  static create (params, callback) {
    return new BillFetchJob(params, callback)
      .addAction(new Actions.FetchAction({
        url: params.url //cannot pass other params or the server spergs out and returns garbage
      }))
      .addAction(new Actions.ParserWrapperAction(BillParser))
      .addAction(new FormatAction(params))
      .addErrorAction(new Actions.HandleConnectionErrorAction(callback, BillFetchJob.create, []))
  }

  constructor (params, callback) {
    super(params.url, callback)
  }
}

module.exports.BillFetchJob = BillFetchJob

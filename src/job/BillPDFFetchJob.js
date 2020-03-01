const Actions = require('@action')
const AbstractJob = require('../util/Job').AbstractJob
const PDFRetrieverAction = Actions.PDFFileRetrieverAction
const PDFParseAction = Actions.PDFParseAction
const HandleDownloadErrorAction = Actions.HandleDownloadErrorAction


class BillPDFFetchJob extends AbstractJob {
  constructor (params, callback) {
    super(params.url, callback)
    this.params = params
  }

  static create (params, callback) {
    return new BillPDFFetchJob(params, callback)
      .addAction(new PDFRetrieverAction(params.url, params.id))
      .addAction(new PDFParseAction(params.url, params.id))
      .addAction(new Actions.FormatAction(params))
      .addErrorAction(new HandleDownloadErrorAction(callback, BillPDFFetchJob.create, params))
  }
}

module.exports.PDFRetrievalJob = BillPDFFetchJob

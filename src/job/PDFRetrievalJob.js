const Actions = require('@action')
const AbstractJob = require('../util/Job').AbstractJob
const PDFRetrieverAction = Actions.PDFFileRetrieverAction
const PDFParseAction = Actions.PDFParseAction
const HandleDownloadErrorAction = Actions.HandleDownloadErrorAction

class PDFRetrievalJob extends AbstractJob {
  constructor (params, callback) {
    super(params.url, callback)
    this.params = params
  }

  static create (params, callback) {
    return new PDFRetrievalJob(params, callback)
      .addAction(new PDFRetrieverAction(params.url, params.bill))
      .addAction(new PDFParseAction(params.url, params.bill))
      .addErrorAction(new HandleDownloadErrorAction(callback, PDFRetrieverAction.create))
  }
}

module.exports.PDFRetrievalJob = PDFRetrievalJob

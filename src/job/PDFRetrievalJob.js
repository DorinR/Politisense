const Actions = require('@action')
const AbstractJob = require('../util/Job').AbstractJob
const PDFRetrieverAction = Actions.PDFFileRetrieverAction
const PDFParseAction = Actions.PDFParseAction
const HandleDownloadErrorAction = Actions.HandleDownloadErrorAction

class PDFRetrievalJob extends AbstractJob {
  constructor (url, bill, callback) {
    super(url, callback)
    this.bill = bill
  }

  static create (url, bill, callback) {
    return new PDFRetrievalJob(url, bill, callback)
      .addAction(new PDFRetrieverAction(url, bill))
      .addAction(new PDFParseAction(url, bill))
      .addErrorAction(new HandleDownloadErrorAction(callback, PDFRetrieverAction.create))
  }
}

module.exports.PDFRetrievalJob = PDFRetrievalJob

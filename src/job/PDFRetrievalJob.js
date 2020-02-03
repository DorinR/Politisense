const utils = require('../util/utils')
const AbstractJob = require('../util/Job').AbstractJob
const PDFRetrieverAction = utils.Actions.PDFRetrieverAction
const PDFParseAction = utils.Actions.PDFParseAction
const HandleDownloadErrorAction = utils.Actions.HandleDownloadErrorAction

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

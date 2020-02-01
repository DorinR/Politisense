const AbstractJob = require('../scraper/Job').AbstractJob
const PDFRetrieverAction = require('../scraper/job_actions/actions').PDFRetrieverAction
const PDFParseAction = require('../scraper/job_actions/actions').PDFParseAction
const HandleDownloadErrorAction = require('../scraper/job_actions/actions').HandleDownloadErrorAction

class PDFRetrievalJob extends AbstractJob {
  constructor (url, bill, callback) {
    super(url, callback)
    this.bill = bill
  }

  static create (url, bill, callback) {
    return new PDFRetrievalJob(url, bill, callback)
      .addAction(new PDFRetrieverAction(url))
      .addAction(new PDFParseAction(bill))
      .addErrorAction(new HandleDownloadErrorAction(url, bill, callback, PDFRetrieverAction.create))
  }
}

module.exports.PDFRetrievalJob = PDFRetrievalJob

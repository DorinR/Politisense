const AbstractJob = require('../scraper/Job').AbstractJob
const PDFFileRetrieverAction = require('../scraper/job_actions/PDFFileRetrieverAction').PDFFileRetrieverAction
const PDFParseAction = require('../scraper/job_actions/PDFParseAction').PDFParseAction
const ScrapeError = require('../scraper/job_actions/LinkScraperAction').ScrapeError

class PDFParseError extends Error {
  constructor (msg) {
    super()
    this.message = msg
    this.name = 'PDFParseError'
  }
}

class PDFRetrievalJob extends AbstractJob {
  constructor (url, bill, callback) {
    super(url, callback)
    this.bill = bill
  }

  initialiseJobComponents () {
    this.retreiver = new PDFFileRetrieverAction(this.url)
    this.parser = new PDFParseAction()
  }

  createNewJob (url, callback) {
    return new PDFRetrievalJob(url, this.bill, callback)
  }

  execute () {
    return new Promise((resolve, reject) => {
      this.retreiver.perform()
        .then(this.parsePDF.bind(this))
        .then(content => {
          this.parser = null
          return {
            name: this.bill,
            content: content
          }
        })
        .then(resolve)
        .catch(e => {
          this.handleErrors(e, reject)
        })
    })
  }

  parsePDF (buffer) {
    return this.parser.perform(buffer)
  }

  handleErrors (e, reject) {
    e.bill = this.bill
    e = this.requeueConnectionFailures(e)
    e = this.requeueDataFailure(e)
    reject(e)
  }

  requeueConnectionFailures (e) {
    const connectionError = AbstractJob.connectionErrorName(e.message)
    if (connectionError) {
      const error = new ScrapeError()
      error.message = `ERROR: Connection failure ${connectionError}, can re-enqueue job: ${this.url}`
      this.queueCallback([new PDFRetrievalJob(this.url, this.bill, this.queueCallback)])
      return error
    }
    return e
  }

  requeueDataFailure (e) {
    if ((!e || !e.message) && !e.parserError) {
      return e
    } else if (e && e.parserError) {
      e.message = e.parserError
    }
    const pdfError = 'InvalidPDF'
    const parseError = 'ParseException'
    if (e.message.includes(pdfError) || e.message.includes(parseError)) {
      const error = new PDFParseError()
      const name = pdfError || (parseError || '')
      error.message = `ERROR: PDF data for: ${this.bill} was corrupted: ${name}, from job: ${this.url}. Will attempt to re-parse`
      this.queueCallback([new PDFRetrievalJob(this.url, this.bill, this.queueCallback)])
      return error
    }
    return e
  }
}

module.exports.PDFRetrievalJob = PDFRetrievalJob
module.exports.PDFParseError = PDFParseError

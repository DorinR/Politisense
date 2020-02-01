const Action = require('./JobAction').AbstractJobAction
const HandleConnectionErrorAction = require('./HandleConnectionErrorAction').HandleConnectionErrorAction
const ScrapeError = require('./LinkScraperAction').ScrapeError

class PDFParseError extends Error {
  constructor (msg) {
    super()
    this.message = msg
    this.name = 'PDFParseError'
  }
}

class HandleDownloadErrorAction extends Action {
  constructor (url, bill, callback, createFn) {
    super()
    this.pdfError = 'InvalidPDF'
    this.parseError = 'ParseException'
    this.url = url
    this.bill = bill
    this.callback = callback
    this.create = createFn
  }

  async perform(e) {
    let error = this.requeueConnectionFailures(e)
    if(error) {
      return error
    }
    error = this.requeueDataFailure(e)
    if(error) {
      return error
    }
  }

  requeueConnectionFailures (e) {
    const connectionError = HandleConnectionErrorAction.connectionErrorName(e.message)
    if (connectionError) {
      const message = `ERROR: Connection failure ${connectionError}, can re-enqueue job: ${this.url}`
      const error = new ScrapeError(message, this.url)
      this.queueCallback([
        this.create(this.url, this.bill, this.queueCallback)
      ])
      return error
    }
    return null
  }

  requeueDataFailure (e) {
    if ((!e || !e.message) && !e.parserError) {
      console.log(e.message)
      return e
    } else if (e && e.parserError) {
      e.message = e.parserError
    }
    if (e.message.includes(this.pdfError) || e.message.includes(this.parseError)) {
      const error = new PDFParseError()
      const name = this.pdfError || (this.parseError || '')
      error.message = `ERROR: PDF data for: ${this.bill} was corrupted: ${name}, from job: ${this.url}. Will attempt to re-parse`
      this.queueCallback([
        this.create(this.url, this.bill, this.queueCallback)
      ])
      return error
    }
    return e
  }
}

module.exports.HandleDownloadErrorAction = HandleDownloadErrorAction
module.exports.PDFParseError = PDFParseError

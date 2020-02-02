const Action = require('./JobAction').AbstractJobAction
const HandleConnectionErrorAction = require('./HandleConnectionErrorAction').HandleConnectionErrorAction
const ScrapeError = require('./ScrapeError').ScrapeError

class PDFParseError extends Error {
  constructor (msg, bill, url) {
    super()
    this.message = msg
    this.name = 'PDFParseError'
    this.bill = bill
    this.url = url
  }
}

class HandleDownloadErrorAction extends Action {
  constructor (callback, createFn) {
    super()
    this.pdfError = 'InvalidPDF'
    this.parseError = 'ParseException'
    this.callback = callback
    this.create = createFn
  }

  async perform (e) {
    let error = this.requeueConnectionFailures(e)
    if (error) {
      return error
    }
    error = this.requeueDataFailure(e)
    if (error) {
      return error
    }
  }

  requeueConnectionFailures (e) {
    const connectionError = HandleConnectionErrorAction.connectionErrorName(e.message)
    if (connectionError) {
      const message = `ERROR: Connection failure ${connectionError}, can re-enqueue job: ${e.url}`
      const error = new ScrapeError(message, e.url)
      this.callback([
        this.create(e.url, e.bill, this.callback)
      ])
      return error
    }
    return null
  }

  requeueDataFailure (e) {
    if (!e) {
      return new Error('ERROR: unexpected behaviour')
    }
    if (!e.message && !e.parserError) {
      return e
    }
    if (e && e.parserError) {
      e.message += ' ' + e.parserError
    }
    if (e.message.includes(this.pdfError) || e.message.includes(this.parseError)) {
      const error = new PDFParseError()
      const name = this.pdfError || (this.parseError || '')
      error.message = `ERROR: PDF data for: ${e.bill} was corrupted: ${name}, from job: ${e.url}. Will attempt to re-parse`
      this.callback([
        this.create(e.url, e.bill, this.callback)
      ])
      return error
    }
    return null
  }
}

module.exports.HandleDownloadErrorAction = HandleDownloadErrorAction
module.exports.PDFParseError = PDFParseError

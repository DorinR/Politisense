const JobAction = require('../JobAction').AbstractJobAction
const HandleConnectionErrorAction = require('./HandleConnectionErrorAction').HandleConnectionErrorAction
const Errors = require('../error/errors')
const ScrapeError = Errors.ScrapeError
const PDFParseError = Errors.PDFParseError

class HandleDownloadErrorAction extends JobAction {
  constructor (callback, createFn, params) {
    super()
    this.pdfError = 'InvalidPDF'
    this.parseError = 'ParseException'
    this.callback = callback
    this.create = createFn
    this.params = params
    this.handled = false
  }

  async perform (e) {
    this.requeueConnectionFailures(e)
    const err = this.requeueDataFailure(e)
    if(!this.handled || err) {
      return err
    }
  }

  requeueConnectionFailures (e) {
    const connectionError = HandleConnectionErrorAction.connectionErrorName(e.message)
    if (connectionError) {
      this.handled = true
      const message = `ERROR: Connection failure ${connectionError}, can re-enqueue job: ${e.url}`
      const error = new ScrapeError(message, this.params.url)
      this.callback([
        this.create(this.params, this.callback)
      ])
    }
  }

  requeueDataFailure (e) {
    if(this.handled) {
      return
    }
    if (!e) {
      this.handled = true
      return new Error('ERROR: unexpected behaviour')
    }
    if (!e.message && !e.parserError) {
      this.handled = true
      return e
    }
    if (e && e.parserError) {
      e.message += ' ' + e.parserError
    }
    if (e.message.includes(this.pdfError) || e.message.includes(this.parseError)) {
      this.handled = true
      const error = new PDFParseError()
      const name = this.pdfError || (this.parseError || '')
      error.message = `ERROR: PDF data for: ${this.params.bill} was corrupted: ${name}, from job: ${this.params.url}. Will attempt to re-parse`
      this.callback([
        this.create(this.params, this.callback)
      ])
    }
  }
}

module.exports.HandleDownloadErrorAction = HandleDownloadErrorAction
module.exports.PDFParseError = PDFParseError

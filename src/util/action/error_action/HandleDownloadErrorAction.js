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
    this.freeError = 'Cannot read property \'free\' of undefined'
    this.callback = callback
    this.create = createFn
    this.params = params
    this.handled = false
  }

  async perform (e) {
    this.requeueConnectionFailures(e)
    this.requeueDataFailure(e)
    if(!this.handled) {
      return e
    }
  }

  requeueConnectionFailures (e) {
    const connectionError = HandleConnectionErrorAction.connectionErrorName(e.message)
    if (connectionError) {
      this.handled = true
      const message = `ERROR: Connection failure ${connectionError}, re-enqueueing job: ${e.url}`
      console.debug(message)
      const error = new ScrapeError(message, this.params.url)
      this.callback([
        this.create(this.params, this.callback)
      ])
      return error
    }
  }

  requeueDataFailure (e) {
    if(this.handled) {
      return
    }
    if (e.message.includes(this.pdfError) || e.message.includes(this.parseError) || e.message.includes(this.freeError)) {
      this.handled = true
      const error = new PDFParseError()
      const name = this.pdfError || (this.parseError || '')
      error.message = `ERROR: PDF data for: ${this.params.id} was corrupted: ${name}, from job: ${this.params.url}. Will attempt to re-parse`
      console.debug(error.message)
      this.callback([
        this.create(this.params, this.callback)
      ])
      return error
    }
  }
}

module.exports.HandleDownloadErrorAction = HandleDownloadErrorAction
module.exports.PDFParseError = PDFParseError

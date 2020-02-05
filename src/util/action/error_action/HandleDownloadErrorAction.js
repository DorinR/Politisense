const JobAction = require('../JobAction').AbstractJobAction
const HandleConnectionErrorAction = require('./HandleConnectionErrorAction').HandleConnectionErrorAction
const Errors = require('../error/errors')
const ScrapeError = Errors.ScrapeError
const PDFParseError = Errors.PDFParseError

class HandleDownloadErrorAction extends JobAction {
<<<<<<< HEAD
  constructor (callback, createFn, params) {
    super()
    this.pdfError = 'InvalidPDF'
    this.parseError = 'ParseException'
    this.freeError = 'Cannot read property \'free\' of undefined'
    this.callback = callback
    this.create = createFn
    this.params = params
    this.error = null
    this.handled = false
  }

  async perform (e) {
    this.requeueConnectionFailures(e)
    this.requeueDataFailure(e)
    if (!this.handled) {
      return e
    }
=======
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
    return e
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
  }

  requeueConnectionFailures (e) {
    const connectionError = HandleConnectionErrorAction.connectionErrorName(e.message)
    if (connectionError) {
<<<<<<< HEAD
      this.handled = true
      const message = `ERROR: Connection failure ${connectionError}, re-enqueueing job: ${this.params.url}`
      console.debug(message)
      this.error = new ScrapeError(message, this.params.url)
      this.callback([
        this.create(this.params, this.callback)
      ])
      return this.error
    }
  }

  requeueDataFailure (e) {
    if (this.handled) {
      return
    }
    if (e.message.includes(this.pdfError) || e.message.includes(this.parseError) || e.message.includes(this.freeError)) {
      this.handled = true
      this.error = new PDFParseError()
      const name = this.pdfError || (this.parseError || '')
      this.error.message = `ERROR: PDF data for: ${this.params.id} was corrupted: ${name}, from job: ${this.params.url}. Will attempt to re-parse`
      console.debug(error.message)
      this.callback([
        this.create(this.params, this.callback)
      ])
      return this.error
    }
=======
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
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
  }
}

module.exports.HandleDownloadErrorAction = HandleDownloadErrorAction
module.exports.PDFParseError = PDFParseError

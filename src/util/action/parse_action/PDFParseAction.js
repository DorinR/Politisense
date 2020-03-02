const PdfReader = require('pdfreader').PdfReader
const JobAction = require('../JobAction').AbstractJobAction
const PDFParseError = require('../error/PDFParseError').PDFParseError

class PDFParseAction extends JobAction {
  constructor (url, bill) {
    super()
    this.buffer = null
    this.parser = new PdfReader()
    this.text = ''
    this.bill = bill
    this.url = url
  }

  perform (buffer) {
    this.buffer = buffer
    return new Promise((resolve, reject) => {
      return this.parser.parseBuffer(this.buffer, (e, item) => {
        if (e) {
          reject(new PDFParseError(e.parserError, this.id, this.url))
        } else if (!item && !e) {
          console.log('INFO: Finished parsing PDF')
          this.buffer = null
          this.parser = null
          resolve(this.text)
        } else if (item && item.text) {
          this.text += ' ' + item.text
        }
      })
    })
  }
}

module.exports.PDFParseAction = PDFParseAction

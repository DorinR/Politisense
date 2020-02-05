const PdfReader = require('pdfreader').PdfReader
const JobAction = require('../JobAction').AbstractJobAction
<<<<<<< HEAD
const PDFParseError = require('../error/PDFParseError').PDFParseError
=======
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend

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
<<<<<<< HEAD
          reject(new PDFParseError(e.parserError, this.id, this.url))
=======
          e.bill = this.bill
          e.url = this.url
          reject(e)
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
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
<<<<<<< HEAD
=======
      .then(content => {
        return {
          name: this.bill,
          content: content
        }
      })
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
  }
}

module.exports.PDFParseAction = PDFParseAction

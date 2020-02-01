const AbstractJobAction = require('./JobAction').AbstractJobAction
const PdfReader = require('pdfreader').PdfReader

class PDFParseAction extends AbstractJobAction {
  constructor (bill) {
    super()
    this.buffer = null
    this.parser = new PdfReader()
    this.text = ''
    this.bill = bill
  }

  perform (buffer) {
    this.buffer = buffer
    return new Promise((resolve, reject) => {
      return this.parser.parseBuffer(this.buffer, (e, item) => {
        if (e) {
          reject(e)
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
      .then(content => {
        return {
          name: this.bill,
          content: content
        }
      })
  }
}

module.exports.PDFParseAction = PDFParseAction

class PDFParseError extends Error {
  constructor (msg, bill, url) {
    super()
    this.message = msg
    this.name = 'PDFParseError'
    this.bill = bill
    this.url = url
  }
}

module.exports.PDFParseError = PDFParseError
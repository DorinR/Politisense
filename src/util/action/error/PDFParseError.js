class PDFParseError extends Error {
  constructor (msg, bill, url) {
    super()
    this.message = msg
    this.name = 'PDFParseError'
    this.id = bill
    this.url = url
  }
}

module.exports.PDFParseError = PDFParseError

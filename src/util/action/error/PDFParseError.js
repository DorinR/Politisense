class PDFParseError extends Error {
  constructor (msg, bill, url) {
    super()
    this.message = msg
    this.name = 'PDFParseError'
<<<<<<< HEAD
    this.id = bill
=======
    this.bill = bill
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
    this.url = url
  }
}

module.exports.PDFParseError = PDFParseError

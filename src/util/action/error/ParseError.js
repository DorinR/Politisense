class ParseError extends Error {
  constructor (msg) {
    super()
    this.message = msg
    this.name = 'ParseError'
  }
}

module.exports.ParseError = ParseError

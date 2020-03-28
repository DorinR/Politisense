class InvalidParameterError extends Error {
  constructor (message) {
    super()
    this.message = message
  }
}

module.exports.InvalidParameterError = InvalidParameterError

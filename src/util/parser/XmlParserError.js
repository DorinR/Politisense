class DataNotFoundError extends Error {
  constructor (msg) {
    super()
    this.message = msg
    this.name = this.constructor.name
  }
}

class ParliamentNotSetError extends Error {
  constructor (msg) {
    super()
    this.message = msg
    this.name = this.constructor.name
  }
}

module.exports.DataNotFoundError = DataNotFoundError
module.exports.ParliamentNotSetError = ParliamentNotSetError

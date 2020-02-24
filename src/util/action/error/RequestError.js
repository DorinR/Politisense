class RequestError extends Error {
  constructor (params) {
    super()
    this.params = params
    this.message = `ERROR: Could retrieve data from ${params.url} using method ${params.method}`
  }
}
module.exports.RequestError = RequestError

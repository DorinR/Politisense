module.exports.ScrapeErrorName = 'ScrapeError'
class ScrapeError extends Error {
  constructor (message, link) {
    super()
    this.message = message
    this.link = link
    this.name = module.exports.ScrapeErrorName
  }
}
module.exports.ScrapeError = ScrapeError

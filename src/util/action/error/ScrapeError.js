module.exports.ScrapeErrorName = 'ScrapeError'
class ScrapeError extends Error {
  constructor (message, link) {
    super()
    this.message = message
    this.link = link
  }
}
module.exports.ScrapeError = ScrapeError

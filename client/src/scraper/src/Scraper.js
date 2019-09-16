const RequestLibrary = require('request-promise')

class ScrapeError extends Error {
  constructor (message) {
    super()
    this.message = message
    this.name = 'ScrapeError'
  }

  static doThrow (e) {
    throw new ScrapeError(e.message)
  }
}

class Scraper {
  constructor (url) {
    this.url = url
  }

  async scrape (url) {
    this.url = (typeof url === 'undefined') ? this.url : url
    return new Promise((resolve, reject) => {
      RequestLibrary(this.url)
        .then((html) => {
          resolve(html)
        })
        .catch((e) => {
          reject(new ScrapeError('could not scrape page: ' + e.message))
        })
    })
  }
}
module.exports.Scraper = Scraper
module.exports.ScrapeError = ScrapeError

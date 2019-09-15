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
  constructor (url, success, fail) {
    this.url = url
    if (typeof fail === 'undefined') {
      this.fail = ScrapeError.doThrow
    } else {
      this.fail = fail
    }
    if (typeof success === 'undefined') {
      this.success = ScrapeError.doThrow
    } else {
      this.success = success
    }
  }

  async scrape () {
    RequestLibrary(this.url)
      .then((html) => {
        this.success(html)
      })
      .catch((e) => {
        this.fail(e)
      })
  }
}
module.exports.Scraper = Scraper
module.exports.ScrapeError = ScrapeError

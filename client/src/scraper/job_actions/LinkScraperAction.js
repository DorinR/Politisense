const requestFn = require('request-promise')
const JobAction = require('./JobAction').AbstractJobAction
const AbstractJob = require('../Job').AbstractJob
const ScrapeErrorName = 'ScrapeError'

class ScrapeError extends Error {
  constructor (message) {
    super()
    this.message = message
    this.name = ScrapeErrorName
  }

  static UnexpectedError (e) {
    if (e.name !== ScrapeErrorName) {
      return e
    }
    return null
  }
}

class LinkScraperAction extends JobAction {
  constructor (url) {
    super()
    this.url = url
    this.send = requestFn
  }

  static headers () {
    return {
      Accept: '*/*',
      'User-Agent': 'PolitisenseScraper/0.1'
    }
  }

  malformedLinkError () {
    const error = new ScrapeError()
    if (!this.url.includes('https://')) {
      error.message = `ERROR: Malformed link passed to scraper: ${this.url}`
      return error
    }
    return null
  }

  connectionError (e) {
    const error = new ScrapeError()
    const connectionError = AbstractJob.connectionErrorName(e.message)
    if (connectionError) {
      error.message = `ERROR: Connection failure ${connectionError}, can re-enqueue job: ${this.url}`
      return error
    }
    return null
  }

  async perform (url) {
    this.url = (typeof url === 'undefined') ? this.url : url
    return new Promise((resolve, reject) => {
      this.send({
        uri: this.url,
        timeout: 60000,
        followAllRedirects: true,
        resolveWithFullResponse: true,
        headers: LinkScraperAction.headers()
      })
        .then(this.logResult.bind(this))
        .then(resolve)
        .catch((e) => {
          reject(new ScrapeError('could not scrape page: ' + e.message))
        })
    })
  }

  logResult (resp) {
    console.debug('Done Scraping: ' + this.url)
    return resp.body
  }
}

module.exports.LinkScraper = LinkScraperAction
module.exports.ScrapeError = ScrapeError
module.exports.ScrapeErrorName = ScrapeErrorName

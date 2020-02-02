const requestFn = require('request-promise')
const JobAction = require('./JobAction').AbstractJobAction
const ScrapeError = require('./ScrapeError').ScrapeError

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
          const error = new ScrapeError(e.message, this.url)
          error.stack = e.stack
          reject(error)
        })
    })
  }

  logResult (resp) {
    console.debug('Done Scraping: ' + this.url)
    return resp.body
  }
}

module.exports.LinkScraper = LinkScraperAction

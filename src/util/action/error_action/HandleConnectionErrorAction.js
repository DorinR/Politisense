const JobAction = require('../JobAction').AbstractJobAction
const ScrapeError = require('../error/errors').ScrapeError
const connectionErrors = [
  'ESOCKETTIMEDOUT',
  'ETIMEDOUT',
  'ECONNRESET',
  'EPIPE',
  'ENOTFOUND'
]

class HandleConnectionErrorAction extends JobAction {
  static connectionErrorName (message) {
    if (!message) {
      return null
    }
    let name = null
    connectionErrors.some(error => {
      if (message.includes(error)) {
        name = error
      }
      return message.includes(error)
    })
    return name
  }

  constructor (callback, creationFn, topLevelDomains) {
    super()
    this.callback = callback
    this.create = creationFn
    this.tlds = topLevelDomains
  }

  async perform (e) {
    this.throwOnUnexpected(e)
    this.requeueOnFailedConnection(e)
    this.reconditionPartialLinks(e)
    this.throwOnMalformedLink(e)
  }

  throwOnUnexpected (e) {
    if (!(e instanceof ScrapeError)) {
      console.debug(e)
      throw e
    }
  }

  requeueOnFailedConnection (e) {
    const connectionError = HandleConnectionErrorAction.connectionErrorName(e.message)
    if (connectionError) {
      const message = 'ERROR: Connection failure ' + connectionError + ', requeuing job: ' + e.link
      const error = new ScrapeError(message, e.link)
      this.callback([
        this.create(e.link, this.callback, this.tlds)
      ])
      console.debug(error.message)
      throw e
    }
  }

  throwOnMalformedLink (e) {
    if (e.link.includes('https://')) {
      const message = 'ERROR: Malformed link passed to scraper: ' + e.link
      const error = new ScrapeError(message, e.link)
      console.debug(error.message)
      throw error
    }
  }

  reconditionPartialLinks (e) {
    let message = null
    let link = null
    if (e.link.startsWith('//')) {
      e.link = 'https:' + e.link
      this.callback([
        this.create(e.link, this.callback, this.tlds)
      ])
      message = 'Re-enqueuing link as: ' + e.link
      link = e.link
    } else if (e.link.startsWith('/')) {
      this.tlds.forEach(tld => {
        const newLink = tld + e.link
        this.callback([
          this.create(newLink, this.callback, this.tlds)
        ])
      })
      message = 'Re-enqueuing link from specified TLDs: ' + e.link
      link = e.link
    }
    if (message && link) {
      throw new ScrapeError(message, link)
    }
  }
}

module.exports.HandleConnectionErrorAction = HandleConnectionErrorAction

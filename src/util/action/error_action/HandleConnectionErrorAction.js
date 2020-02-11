const JobAction = require('../JobAction').AbstractJobAction
const ScrapeError = require('../error/errors').ScrapeError
const connectionErrors = [
  'ESOCKETTIMEDOUT',
  'ETIMEDOUT',
  'timeout',
  'status code 500',
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
    this.handled = false
  }

  async perform (e) {
    let err = this.throwOnUnexpected(e)
    if (err) {
      return err
    }
    this.requeueOnFailedConnection(e)
    this.reconditionPartialLinks(e)
    err = this.throwOnMalformedLink(e)
    if (err) {
      return err
    }
  }

  throwOnUnexpected (e) {
    if (!(e instanceof ScrapeError)) {
      console.debug(e)
      return e
    }
  }

  requeueOnFailedConnection (e) {
    const connectionError = HandleConnectionErrorAction.connectionErrorName(e.message)
    if (connectionError) {
      this.handled = true
      const message = 'ERROR: Connection failure ' + connectionError + ', requeuing job: ' + e.link
      const error = new ScrapeError(message, e.link)
      this.callback([
        this.dynamicCreate(e, e.link)
      ])
      console.debug(error.message)
      return e
    }
  }

  throwOnMalformedLink (e) {
    if (e.link.includes('https://') && !this.handled) {
      const message = 'ERROR: Unspecified error occurred at link passed to scraper: ' + e.link
      const error = new ScrapeError(message + '\n' + e.message, e.link)
      console.debug(error.message)
      return error
    }
  }

  reconditionPartialLinks (e) {
    let message = null
    let link = null
    if (e.link.startsWith('//')) {
      e.link = 'https:' + e.link
      this.callback([
        this.dynamicCreate(e, e.link)
      ])
      message = 'Re-enqueuing link as: ' + e.link
      link = e.link
    } else if (e.link.startsWith('/')) {
      this.tlds.forEach(tld => {
        const newLink = tld + e.link
        this.callback([
          this.dynamicCreate(e, newLink)
        ])
      })
      message = 'Re-enqueuing link from specified TLDs: ' + e.link
      link = e.link
    }
    if (message && link) {
      this.handled = true
      return new ScrapeError(message, link)
    }
  }

  dynamicCreate (e, link) {
    if(this.create.length === 2) {
      return this.create(this.tlds, this.callback)
    } else if (this.create.length === 3) {
      return this.create(link, this.callback, this.tlds)
    } else {
      console.warn('WARN: function of wrong arity passed to error handling requeue mechanism')
    }
  }
}

module.exports.HandleConnectionErrorAction = HandleConnectionErrorAction

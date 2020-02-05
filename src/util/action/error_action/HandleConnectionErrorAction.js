const JobAction = require('../JobAction').AbstractJobAction
const ScrapeError = require('../error/errors').ScrapeError
const connectionErrors = [
  'ESOCKETTIMEDOUT',
  'ETIMEDOUT',
<<<<<<< HEAD
  'timeout', // this error and the proceeding 3 are in response to error code fuzzing from the server
  'status code 500',
  'status code 503',
  'status code 404',
=======
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
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
<<<<<<< HEAD
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
=======
  }

  async perform (e) {
    let error = this.throwOnUnexpected(e)
    if (error) {
      return error
    }
    error = this.requeueOnFailedConnection(e)
    if (error) {
      return error
    }
    error = this.throwOnMalformedLink(e)
    if (error) {
      return error
    }
    error = this.reconditionPartialLinks(e)
    if (error) {
      return error
    }
    return e
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
  }

  throwOnUnexpected (e) {
    if (!(e instanceof ScrapeError)) {
      console.debug(e)
      return e
    }
<<<<<<< HEAD
=======
    return null
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
  }

  requeueOnFailedConnection (e) {
    const connectionError = HandleConnectionErrorAction.connectionErrorName(e.message)
<<<<<<< HEAD
    if (connectionError && !this.handled) {
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
=======
    if (connectionError) {
      const message = 'ERROR: Connection failure ' + connectionError + ', requeuing job: ' + e.link
      const error = new ScrapeError(message, e.link)
      this.callback([
        this.create(e.link, this.callback, this.tlds)
      ])
      console.debug(error.message)
      return error
    }
    return null
  }

  throwOnMalformedLink (e) {
    if (e.link.includes('https://')) {
      const message = 'ERROR: Malformed link passed to scraper: ' + e.link
      const error = new ScrapeError(message, e.link)
      console.debug(error.message)
      return error
    }
    return null
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
  }

  reconditionPartialLinks (e) {
    let message = null
    let link = null
    if (e.link.startsWith('//')) {
      e.link = 'https:' + e.link
      this.callback([
<<<<<<< HEAD
        this.dynamicCreate(e, e.link)
=======
        this.create(e.link, this.callback, this.tlds)
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
      ])
      message = 'Re-enqueuing link as: ' + e.link
      link = e.link
    } else if (e.link.startsWith('/')) {
      this.tlds.forEach(tld => {
        const newLink = tld + e.link
        this.callback([
<<<<<<< HEAD
          this.dynamicCreate(e, newLink)
=======
          this.create(newLink, this.callback, this.tlds)
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
        ])
      })
      message = 'Re-enqueuing link from specified TLDs: ' + e.link
      link = e.link
    }
<<<<<<< HEAD
    if (message && link && !this.handled) {
      this.handled = true
      return new ScrapeError(message, link)
    }
  }

  dynamicCreate (e, link) {
    if (this.create.length === 2) {
      return this.create(this.tlds, this.callback)
    } else if (this.create.length === 3) {
      return this.create(link, this.callback, this.tlds)
    } else {
      console.warn('WARN: function of wrong arity passed to error handling requeue mechanism')
=======
    if (message && link) {
      return new ScrapeError(message, link)
    } else {
      return null
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
    }
  }
}

module.exports.HandleConnectionErrorAction = HandleConnectionErrorAction
<<<<<<< HEAD
module.exports.ErrorCodes = connectionErrors
=======
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend

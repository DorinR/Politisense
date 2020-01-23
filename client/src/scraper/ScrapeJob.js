const Scraper = require('./job_actions/LinkScraperAction').LinkScraper
const ScrapeError = require('./job_actions/LinkScraperAction').ScrapeError
const ScrapeErrorName = require('./job_actions/LinkScraperAction').ScrapeErrorName
const Parser = require('./job_actions/TextParserAction').TextParser
const Processor = require('./job_actions/SelectionAction').Selector
const Job = require('./Job').AbstractJob

class ScrapeJob extends Job {
  // eslint-disable-next-line no-useless-constructor
  constructor (url, manager, topLevelDomains) {
    super(url, manager)
    this.tlds = typeof topLevelDomains === 'undefined' ? ['https://www.ourcommons.ca', 'https://www.parl.ca'] : topLevelDomains
  }

  initialiseJobComponents () {
    this.scraper = new Scraper(this.url)
    this.parser = new Parser()
    this.processor = new Processor()
  }

  parse (html) {
    const $ = this.parser.load(html)
    const select = (elem) => {
      return $(elem).attr('href')
    }
    return this.parser.perform(html, 'a', select)
  }

  process (links) {
    return this.processor.perform(links)
  }

  requeueLinks (urls) {
    const newJobs = super.createNewJobs(urls)
    this.queueCallback(newJobs)
    return this.result()
  }

  requestBody (req) {
    return req.body
  }

  createNewJob (url, callback) {
    return new ScrapeJob(url, callback, this.tlds)
  }

  result () {
    return this.processor.selected
  }

  throwOnUnexpected (e, reject) {
    if (e.name !== ScrapeErrorName) {
      console.debug(e.message)
      reject(e)
    }
  }

  requeueOnFailedConnection (e, reject) {
    const error = new ScrapeError()
    const link = this.scraper.url
    const connectionError = Job.connectionErrorName(e.message)
    if (connectionError) {
      error.message = 'ERROR: Connection failure ' + connectionError + ', requeuing job: ' + link
      this.queueCallback([new ScrapeJob(link, this.queueCallback, this.tlds)])
      console.debug(error.message)
      reject(error)
    }
  }

  throwOnMalformedLink (e, reject) {
    const error = new ScrapeError()
    const link = this.scraper.url
    if (this.scraper.url.includes('https://')) {
      error.message = 'ERROR: Malformed link passed to scraper: ' + link
      console.debug(error.message)
      reject(error)
    }
  }

  reconditionPartialLinks (e, reject) {
    const error = new ScrapeError()
    let link = this.scraper.url
    if (this.scraper.url.startsWith('//')) {
      link = 'https:' + this.scraper.url
      this.queueCallback([new ScrapeJob(link, this.queueCallback, this.tlds)])
      error.message = 'Re-enqueuing link as: ' + link
    } else if (this.scraper.url.startsWith('/')) {
      this.tlds.forEach(tld => {
        const newLink = tld + link
        this.queueCallback([new ScrapeJob(newLink, this.queueCallback, this.tlds)])
        error.message = ''
      })
    }
    reject(error)
  }

  handleError (e, reject) {
    this.done = true
    this.throwOnUnexpected(e, reject)
    this.throwOnMalformedLink(e, reject)
    this.requeueOnFailedConnection(e, reject)
    this.reconditionPartialLinks(e, reject)
  }

  async execute () {
    return new Promise((resolve, reject) => {
      this.scraper.perform()
        .then(this.requestBody.bind(this))
        .then(this.parse.bind(this))
        .then(this.process.bind(this))
        .then(this.requeueLinks.bind(this))
        .then(resolve)
        .catch(e => {
          this.handleError(e, reject)
        })
    })
  }
}
module.exports.ScrapeJob = ScrapeJob

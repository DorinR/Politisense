const AbstractJob = require('../scraper/Job').AbstractJob
const LinkScraper = require('../scraper/job_actions/LinkScraperAction').LinkScraper
const ScrapeError = require('../scraper/job_actions/LinkScraperAction').ScrapeError
const TextParser = require('../scraper/job_actions/TextParserAction').TextParser
const Selector = require('../scraper/job_actions/SelectionAction').Selector

class BillPDFFinderJob extends AbstractJob {
  constructor (url, bill, callback) {
    super(url, callback)
    this.bill = bill
  }

  initialiseJobComponents () {
    this.scraper = new LinkScraper(this.url)
    this.parser = new TextParser()
    this.groupSelector = new Selector('/Content/Bills/')
    this.pdfSelector = new Selector('PDF')
  }

  createNewJob (url, callback) {
    return new BillPDFFinderJob(url, this.bill, callback)
  }

  execute () {
    const p = new Promise((resolve, reject) => {
      this.scraper.perform()
        .then(this.parseForLinks.bind(this))
        .then(this.selectPdfFileFromLinks.bind(this))
        .then(link => {
          return {
            link: link,
            id: this.bill
          }
        })
        .then(resolve)
        .catch(e => {
          this.handleErrors(e, reject.bind(p))
        })
    })
    return p
  }

  parseForLinks (resp) {
    const html = resp.body
    const $ = this.parser.load(html)
    return this.parser.perform(html, 'a', (elem) => {
      return $(elem).attr('href')
    })
  }

  async selectPdfFileFromLinks (links) {
    await this.groupSelector.perform(links)
    await this.pdfSelector.perform(this.groupSelector.selected)
    return this.pdfSelector.selected[0]
  }

  handleErrors (e, reject) {
    e = this.requeueConnectionFailures(e)
    e = this.throwOnMalformedLink(e)
    e = this.throwOnUnexpectedError(e)
    reject(e)
  }

  requeueConnectionFailures (e) {
    const error = this.scraper.connectionError(e)
    if (error !== null) {
      this.queueCallback([new BillPDFFinderJob(this.url, this.bill, this.queueCallback)])
      return error
    }
    return e
  }

  throwOnMalformedLink (e) {
    const error = this.scraper.malformedLinkError()
    if (error !== null) {
      return error
    }
    return e
  }

  throwOnUnexpectedError (e) {
    const error = ScrapeError.UnexpectedError(e)
    if (error !== null) {
      return error
    }
    return e
  }
}

module.exports.BillPDFFinderJob = BillPDFFinderJob

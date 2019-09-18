const Scraper = require('./WebPageScraper').Scraper
const ScrapeError = require('./WebPageScraper').ScrapeError
const Parser = require('./Parser').Parser
const Processor = require('./LinkSelectorXML').Processor

class ProcessingError extends Error {
  constructor (msg) {
    super()
    this.message = msg
    this.name = 'ProcessingError'
  }
}
class ScrapeJob {
  constructor (url, mngr) {
    this.scraper = new Scraper(url)
    this.parser = new Parser()
    this.processor = new Processor()
    this.mngr = mngr
    this.tlds = ['https://www.ourcommons.ca', 'https://www.parl.ca']
  }

  parse (html) {
    const $ = this.parser.load(html)
    const select = (elem) => {
      return $(elem).attr('href')
    }
    return this.parser.parseHTML(html, 'a', select)
  }

  process (links) {
    return this.processor.process(links)
  }

  createNewJobs (urls) {
    const newJobs = []
    urls.forEach((url) => {
      newJobs.push(new ScrapeJob(url, this.mngr))
    })
    return newJobs
  }

  getXmlLinks () {
    return this.processor.xmlLinks
  }

  async execute () {
    return new Promise((resolve, reject) => {
      this.scraper.scrape()
        .then((html) => {
          return this.parse(html)
        })
        .then((links) => {
          return this.process(links)
        })
        .then((urls) => {
          this.mngr.enqueueJobsCb(this.createNewJobs(urls))
          resolve(this.getXmlLinks())
        })
        .catch((e) => {
          let link = this.scraper.url
          const error = new ScrapeError('Malformed link passed to scraper: ' + link)
          if (this.scraper.url.includes('https://')) {
            reject(error)
          }
          if (this.scraper.url.startsWith('//')) {
            link = 'https:' + this.scraper.url
            this.mngr.enqueueJobsCb([new ScrapeJob(link, this.mngr)])
            error.message = 're-enqueuing link as: ' + link
          } else if (this.scraper.url.startsWith('/')) {
            link = this.tlds[0] + this.scraper.url
            this.mngr.enqueueJobsCb([new ScrapeJob(link, this.mngr)])
            const link0 = this.tlds[1] + this.scraper.url
            this.mngr.enqueueJobsCb([new ScrapeJob(link0, this.mngr)])
            error.message = 're-enqueuing link as: ' + link + ' and as ' + link0
          }
          reject(error)
        })
    })
  }
}
module.exports.Job = ScrapeJob
module.exports.ProcessingError = ProcessingError

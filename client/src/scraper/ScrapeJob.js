const Scraper = require('./job_actions/LinkScraperAction').LinkScraper
const ScrapeError = require('./job_actions/LinkScraperAction').ScrapeError
const ScrapeErrorName = require('./job_actions/LinkScraperAction').ScrapeErrorName
const Parser = require('./job_actions/TextParserAction').TextParser
const Processor = require('./job_actions/XmlLinkSelectionAction').XmlLinkSelector
const Job = require('./Job').AbstractJob

class ScrapeJob extends Job {
  // eslint-disable-next-line no-useless-constructor
  constructor (url, manager, topLevelDomains) {
    super(url, manager, topLevelDomains)
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

  createNewJob (url, manager) {
    return new ScrapeJob(url, manager)
  }

  result () {
    return this.processor.xmlLinks
  }

  async execute () {
    return new Promise((resolve, reject) => {
      this.scraper.perform()
        .then((html) => {
          return this.parse(html.body)
        })
        .then((links) => {
          return this.process(links)
        })
        .then((urls) => {
          this.manager.enqueueJobsCb(super.createNewJobs(urls))
          this.done = true
          resolve(this.result())
        })
        .catch((e) => {
          let link = this.scraper.url
          this.done = true
          if (e.name !== ScrapeErrorName) {
            reject(e)
          }
          const error = new ScrapeError('Malformed link passed to scraper: ' + link + '\n' + e.message)
          if (this.scraper.url.includes('https://')) {
            reject(error)
          }
          if (this.scraper.url.startsWith('//')) {
            link = 'https:' + this.scraper.url
            this.manager.enqueueJobsCb([new ScrapeJob(link, this.manager, this.tlds)])
            error.message = 're-enqueuing link as: ' + link
          } else if (this.scraper.url.startsWith('/')) {
            this.tlds.forEach(tld => {
              const newLink = tld + link
              this.manager.enqueueJobsCb([new ScrapeJob(newLink, this.manager, this.tlds)])
            })
          }
          reject(error)
        })
    })
  }
}
module.exports.ScrapeJob = ScrapeJob

import { Scraper, ScrapeError } from './Scraper'
import { Parser } from './Parser'
import { Processor } from './Processor'
import { ScrapeManager } from './ScrapeManager'

class ProcessingError extends Error {
  constructor (msg) {
    super()
    this.message = msg
    this.name = 'ProcessingError'
  }
}
class Job {
  constructor (url, cb) {
    this.scraper = new Scraper(url)
    this.parser = new Parser()
    this.processor = new Processor()
    this.jobList = []
    this.enqueueCb = (typeof cb === 'undefined') ? function () {} : cb
  }

  parse (html) {
    const $ = this.parser.load(html)
    const select = (elem) => {
      return $(elem).attr('href')
    }
    return this.parser.parse(html, 'a', select)
  }

  process (links) {
    return this.processor.process(links)
  }

  createNewJobs (urls) {
    const newJobs = []
    urls.forEach((url) => {
      newJobs.push(new Job(url, this.enqueueCb))
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
          this.enqueueCb(this.createNewJobs(urls))
          resolve(this.getXmlLinks())
        })
        .catch((e) => {
          if (this.scraper.url.includes('https://')) {
            reject(new ScrapeError('Malformed link passed to scraper: ' + e.message))
          }
          this.enqueueCb([new Job('https:' + this.scraper.url, this.enqueueCb)])
          resolve([])
        })
    })
  }
}
module.exports.Job = Job
module.exports.ProcessingError = ProcessingError

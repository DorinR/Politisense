const Queue = require('./utilities/Queue').Queue
const ScrapeJob = require('./ScrapeJob').ScrapeJob
const Reader = require('./job_actions/UrlFileReaderAction').FileReader
class ScrapeJobManager {
  constructor (count, wait, startingUrl, topLevelDomains) {
    this.linkQueue = new Queue()
    this.xmlSet = new Set()
    this.returnedLinkCount = typeof count === 'undefined' ? 50 : count
    this.waitPeriod = typeof wait === 'undefined' ? 5000 : wait
    this.startingUrl = typeof startingUrl === 'undefined' ? 'https://www.ourcommons.ca' : startingUrl
    this.topLevelDomains = topLevelDomains
    this.jobs = []
  }

  async getXmlContent () {
    return new Promise((resolve, reject) => {
      this.startScrape(this.startingUrl)
        .then((xmlSet) => {
          return this.createXmlLinks(xmlSet)
        })
        .then((xmlLinks) => {
          return this.getXmlContentFromLinks(xmlLinks)
        })
        .then((xmlContent) => {
          resolve(xmlContent)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  async startScrape (url) {
    this.linkQueue.enqueue(new ScrapeJob(url, this))
    await this.init(this.linkQueue.dequeue())
    await this.traverse()
    return this.xmlSet
  }

  getXmlContentFromLinks (xmlLinks) {
    console.log('Retrieving xml content from links...')
    return this.xmlContent(xmlLinks)
  }

  xmlContent (xmlLinks) {
    const xmlContentList = []
    xmlLinks.forEach((link) => {
      const r = new Reader(link)
      try {
        const xml = r.perform()
        xmlContentList.push(xml)
      } catch (e) {
        console.error(e.message)
      }
    })
    return xmlContentList
  }

  enqueueJobsCb (jobs) {
    jobs.forEach((job) => {
      try {
        this.linkQueue.enqueue(job)
      } catch (e) {}
    })
  }

  async init (job) {
    await job.execute()
      .then((xml) => {
        if (xml.length > 0) {
          this.xmlSet.join(xml)
        }
      })
      .catch((e) => {
        throw e
      })
  }

  async traverse () {
    while (this.xmlSet.size < this.returnedLinkCount) {
      let job = null
      try {
        job = this.linkQueue.dequeue()
        this.jobs.push(job)
      } catch (e) {
        let currentIndex = 0
        while (currentIndex < this.jobs.length) {
          if (this.jobs[currentIndex].done === true) {
            this.jobs.splice(currentIndex)
          } else {
            currentIndex++
          }
        }
        this.logActiveJobCount()
        await this.sleep(this.waitPeriod)
        this.logNewJobCount()
        continue
      }
      job.execute()
        .then((xmlLinks) => {
          if (xmlLinks.length > 0) {
            xmlLinks.forEach((xml) => {
              this.xmlSet.add(xml)
              this.xmlLinkProgress()
            })
          }
        })
        .catch((e) => {
          if (e.name !== 'ScrapeError') {
            console.log(e.message)
          }
        })
    }
    this.finish()
  }

  logNewJobCount () {
    if (this.linkQueue.size() > 0) {
      console.log('starting to process ' + this.linkQueue.size() + ' scraping jobs...')
    }
  }

  logActiveJobCount () {
    if (this.activeJobCount > 0) {
      console.log('There are ' + this.jobs.length + ' active scraping jobs, waiting for them to complete')
    }
  }

  finish () {
    console.log('Found ' + this.returnedLinkCount + ' XML Links, stopping scraping process')
  }

  xmlLinkProgress () {
    if (this.xmlSet.size > 0) {
      console.log('There are currently ' + this.xmlSet.size + ' potential xml links')
    }
  }

  sleep (ms) {
    if (this.linkQueue.size() < 100) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
    }
  }

  createXmlLinks (xmlSet) {
    const xmlLinks = []
    const j = new ScrapeJob()
    xmlSet.forEach((link) => {
      let included = false
      j.tlds.forEach(tld => {
        if (link.includes(tld)) {
          xmlLinks.push(link)
          included = true
        }
      })
      if (!included) {
        j.tlds.forEach(tld => {
          xmlLinks.push(tld + link)
        })
      }
    })
    return xmlLinks
  }
}

class ScrapeRunner {
  constructor (count, wait, startingUrl, topLevelDomains) {
    this.manager = new ScrapeJobManager(count, wait, startingUrl, topLevelDomains)
  }

  getXmlContent () {
    require('events').EventEmitter.defaultMaxListeners = 1000
    return this.manager.getXmlContent()
  }
}

module.exports.ScrapeRunner = ScrapeRunner

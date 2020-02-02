const Queue = require('../../util/queue/UniqueJobQueue').UniqueJobQueue
const ScrapeJob = require('../../job/ScrapeJob').ScrapeJob
const ScrapeError = require('../../util/action/error/ScrapeError').ScrapeError
const Reader = require('../../util/action/fetch_action/XmlFileRetrieverAction').FileReader

class ScrapeJobManager {
  constructor (count, wait, startingUrl, topLevelDomains) {
    this.linkQueue = new Queue()
    this.xmlSet = new Set()
    this.returnedLinkCount = typeof count === 'undefined' ? 150 : count
    this.waitPeriod = typeof wait === 'undefined' ? 5000 : wait
    this.startingUrl = typeof startingUrl === 'undefined' ? 'https://www.ourcommons.ca/' : startingUrl
    this.topLevelDomains = typeof topLevelDomains === 'undefined' ? ['https://www.ourcommons.ca/', 'https://www.parl.ca/'] : topLevelDomains
    this.jobs = []
    this.activeJobCount = 0
    this.shouldQueue = true
  }

  async getXmlContent () {
    return new Promise((resolve, reject) => {
      this.startScrape(this.startingUrl)
        .then(this.createXmlLinks.bind(this))
        .then(this.getXmlContentFromLinks.bind(this))
        .then(resolve)
        .catch(reject)
    })
  }

  async startScrape (url) {
    this.linkQueue.enqueue(ScrapeJob.create(url, this.enqueueJobsCb.bind(this), this.topLevelDomains))
    await this.init(this.linkQueue.dequeue())
    await this.traverse()
    return this.xmlSet
  }

  getXmlContentFromLinks (xmlLinks) {
    console.log('--------------------------------------------------------------------------------------------------------')
    console.log('INFO: Retrieving xml content from links...')
    console.log('--------------------------------------------------------------------------------------------------------')
    return this.xmlContent(xmlLinks)
  }

  xmlContent (xmlLinks) {
    const xmlContentList = []
    xmlLinks.forEach(async (link) => {
      const r = new Reader(link)
      try {
        const xml = r.perform()
        xmlContentList.push(xml)
        await this.hold(25)
      } catch (e) {
        console.error(e.message)
      }
    })
    return xmlContentList
  }

  enqueueJobsCb (jobs) {
    if (!this.shouldQueue) {
      this.logOutstandingJobs()
      return
    }
    jobs.some((job) => {
      let shouldSkip = true
      try {
        this.topLevelDomains.some(tld => {
          const link = tld.slice(12, tld.length - 1)
          if (job.url.includes(link)) {
            shouldSkip = false
            return !shouldSkip
          }
        })
        if (!shouldSkip) {
          this.linkQueue.enqueue(job)
        }
      } catch (e) {
        if (!(e instanceof RangeError)) {
          console.log('range error')
          console.log(e.message)
        }
      }
    })
  }

  async init (job) {
    await job.execute()
      .then(this.filterXmlLinks.bind(this))
      .catch((e) => {
        throw e
      })
  }

  filterXmlLinks (xmls) {
    if (xmls && xmls.length > 0) {
      xmls.forEach(xml => {
        this.xmlSet.add(xml)
      })
      this.xmlLinkProgress()
    }
  }

  logUnexpectedError (e) {
    if (!(e instanceof ScrapeError)) {
      console.error(e.message)
    }
  }

  pruneCompletedJobs () {
    let currentIndex = 0
    while (currentIndex < this.jobs.length) {
      if (this.jobs[currentIndex].done === true) {
        this.jobs.splice(currentIndex)
      } else {
        currentIndex++
      }
    }
  }

  async traverse () {
    while (this.xmlSet.size < this.returnedLinkCount) {
      let job = null
      try {
        job = this.linkQueue.dequeue()
        this.jobs.push(job)
      } catch (e) {
        console.debug('INFO: ' + e.message + ', waiting for links to return..')
        this.pruneCompletedJobs()
        await this.sleep(1000)
        continue
      }
      this.activeJobCount++
      job.execute()
        .then(this.filterXmlLinks.bind(this))
        .catch(this.logUnexpectedError.bind(this))
        .finally(async () => {
          this.activeJobCount--
          await this.hold(this.waitPeriod)
        })
    }
    await this.finish()
  }

  async finish () {
    this.shouldQueue = false
    console.log('--------------------------------------------------------------------------------------------------------')
    console.log('INFO: Found the minimum (' + this.returnedLinkCount + ') number of XML Links. No more requests will be queued, but connection errors will be re-tried.')
    console.log('--------------------------------------------------------------------------------------------------------')
    while (this.activeJobCount > 0) {
      this.logOutstandingJobs()
      await this.hold(10000)
    }
  }

  logOutstandingJobs () {
    console.log('INFO: Waiting for ' + this.activeJobCount + ' jobs to complete before processing xml links...')
  }

  xmlLinkProgress () {
    if (this.xmlSet.size > 0) {
      console.debug('INFO: There are currently ' + this.xmlSet.size + ' potential xml links')
    }
  }

  sleep (ms) {
    if (this.linkQueue.size() < 100 || this.linkQueue.size() > 1000) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
    }
  }

  hold (ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  createXmlLinks (xmlSet) {
    const xmlLinks = []
    xmlSet.forEach((link) => {
      let included = false
      this.topLevelDomains.forEach(tld => {
        if (link.includes(tld)) {
          xmlLinks.push(link)
          included = true
        }
      })
      if (!included) {
        this.topLevelDomains.forEach(tld => {
          xmlLinks.push(tld + link)
        })
      }
    })
    return xmlLinks
  }
}

class ScrapeRunner {
  constructor (minimumFileCount, requestWaveInterval, startingUrl, domainScope) {
    this.manager = new ScrapeJobManager(minimumFileCount, requestWaveInterval, startingUrl, domainScope)
  }

  getXmlContent () {
    require('events').EventEmitter.defaultMaxListeners = 1000
    return new Promise((resolve, reject) => {
      this.manager.getXmlContent()
        .then(promises => {
          Promise
            .all(promises)
            .then(xmls => {
              resolve(xmls.filter(xml => xml !== null))
            })
            .catch(reject)
        })
        .catch(reject)
    })
  }
}

module.exports.ScrapeRunner = ScrapeRunner

new ScrapeRunner()
  .getXmlContent()

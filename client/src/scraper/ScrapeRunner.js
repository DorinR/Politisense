const Queue = require('./utilities/Queue').Queue
const ScrapeJob = require('./ScrapeJob').ScrapeJob
const Reader = require('./job_actions/UrlFileReaderAction').FileReader
class ScrapeJobManager {
  constructor (count, wait, startingUrl, topLevelDomains) {
    this.linkQueue = new Queue()
    this.xmlSet = new Set()
    this.returnedLinkCount = typeof count === 'undefined' ? 150 : count
    this.waitPeriod = typeof wait === 'undefined' ? 5000 : wait
    this.startingUrl = typeof startingUrl === 'undefined' ? 'https://www.ourcommons.ca' : startingUrl
    this.topLevelDomains = typeof topLevelDomains === 'undefined' ? ['https://www.ourcommons.ca', 'https://www.parl.ca'] : topLevelDomains
    this.jobs = []
    this.activeJobCount = 0
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
    console.log('--------------------------------------------------------------------------------------------------------')
    console.log('Retrieving xml content from links...')
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
        if (typeof e !== typeof (new RangeError())) {
          console.log(e.message)
        }
      }
    })
  }

  async init (job) {
    await job.execute()
      .then((xml) => {
        if (xml.length > 0) {
          xml.forEach(x => {
            this.xmlSet.add(x)
          })
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
      this.activeJobCount++
      job.execute()
        .then((xmlLinks) => {
          this.activeJobCount--
          if (xmlLinks.length > 0) {
            xmlLinks.forEach((xml) => {
              this.xmlSet.add(xml)
              this.xmlLinkProgress()
            })
          }
        })
        .catch((e) => {
          this.activeJobCount--
          if (e.name !== 'ScrapeError') {
            console.error(e.message)
          }
        })
    }
    await this.finish()
  }

  logNewJobCount () {
    if (this.linkQueue.size() > 0) {
      console.debug('starting to process ' + this.linkQueue.size() + ' scraping jobs...')
    }
  }

  logActiveJobCount () {
    if (this.activeJobCount > 0) {
      console.debug('There are ' + this.jobs.length + ' active scraping jobs, waiting for them to complete')
    }
  }

  async finish () {
    console.log('--------------------------------------------------------------------------------------------------------')
    console.log('Found the minimum (' + this.returnedLinkCount + ') number of XML Links. No more requests will be queued.')
    console.log('--------------------------------------------------------------------------------------------------------')
    while (this.activeJobCount > 0) {
      console.log('Waiting for ' + this.activeJobCount + ' jobs to complete before processing xml links...')
      await this.hold(10000)
    }
  }

  xmlLinkProgress () {
    if (this.xmlSet.size > 0) {
      console.debug('There are currently ' + this.xmlSet.size + ' potential xml links')
    }
  }

  sleep (ms) {
    if (this.linkQueue.size() < 100) {
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
  constructor (minimumFileCount, requestWaveInterval, startingUrl, domainScope) {
    this.manager = new ScrapeJobManager(minimumFileCount, requestWaveInterval, startingUrl, domainScope)
  }

  getXmlContent () {
    require('events').EventEmitter.defaultMaxListeners = 1000
    return new Promise(resolve => {
      this.manager.getXmlContent()
        .then(promises => {
          Promise.all(promises)
            .then(xmls => {
              resolve(xmls.filter(xml => xml !== null))
            })
        })
    })
  }
}

module.exports.ScrapeRunner = ScrapeRunner

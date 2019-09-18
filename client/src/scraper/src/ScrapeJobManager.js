const Queue = require('./Queue').Queue
const Job = require('./ScrapeJob').Job
const Reader = require('./XMLFileContentReader').Reader

class ScrapeJobManager {
  constructor () {
    this.linkQueue = new Queue()
    this.xmlSet = new Set()
    this.activeJobCount = 0
    this.startingUrl = 'https://www.parl.ca'
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
    this.linkQueue.enqueue(new Job(url, this))
    await this.init(this.linkQueue.dequeue())
    await this.traverse()
    return this.xmlSet
  }

  getXmlContentFromLinks (xmlLinks) {
    console.log('Retrieving xml content from links')
    return this.xmlContent(xmlLinks)
  }

  xmlContent (xmlLinks) {
    const xmlContentList = []
    xmlLinks.forEach((link) => {
      const r = new Reader(link)
      try {
        const xml = r.read()
        xmlContentList.push(xml)
      } catch (e) {}
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
      .catch((e) => {})
  }

  async traverse () {
    while (this.xmlSet.size < 50) {
      let job = ''
      try {
        job = this.linkQueue.dequeue()
        this.activeJobCount++
        if (this.activeJobCount > 1000) {
          require('events').EventEmitter.defaultMaxListeners = 2 * this.activeJobCount
          continue
        }
      } catch (e) {
        console.log('There are ' + this.activeJobCount + ' active scraping jobs, waiting for them to complete')
        await this.sleep(1000)
        console.log('starting to process ' + this.linkQueue.size() + ' scraping jobs...')
        continue
      }
      job.execute()
        .then((xmlLinks) => {
          this.activeJobCount--
          if (xmlLinks.length > 0) {
            xmlLinks.forEach((xml) => {
              this.xmlSet.add(xml)
            })
          }
        })
        .catch((e) => {
          this.activeJobCount--
          if (e.name !== 'ScrapeError') {
            console.log(e.message)
          }
        })
    }
  }

  sleep (ms) {
    if (this.linkQueue.size() < 10) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
    }
  }

  createXmlLinks (xmlSet) {
    const xmlLinks = []
    const j = new Job()
    xmlSet.forEach((i) => {
      if (i.includes(j.tlds[0]) || i.includes(j.tlds[1])) {
        xmlLinks.push(i)
      } else {
        xmlLinks.push(j.tlds[0] + i)
        xmlLinks.push(j.tlds[1] + i)
      }
    })
    return xmlLinks
  }
}

module.exports.ScrapeRunner = ScrapeJobManager

var runner = new ScrapeJobManager()

const t = async () => {
  await runner.getXmlContent()
    .then((xmlContent) => {
      console.log(xmlContent)
    })
    .catch((e) => {
      console.error(e.message)
    })
}
t()

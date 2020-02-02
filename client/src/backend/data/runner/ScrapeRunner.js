const Utils = require('../../util/utils')
const UniqueJobQueue = Utils.Queues.UniqueJobQueue
const QueueManager = Utils.QueueManager.QueueManager
const StartScrapeAction = Utils.QueueManager.Start.StartScrapeAction
const StopScrapeAction = Utils.QueueManager.Stop.StopScrapeAction

class ScrapeJobManager extends QueueManager {
  static create (count, wait = 5000, startingUrl, topLevelDomains) {
    const manager = new ScrapeJobManager(wait, startingUrl, topLevelDomains)
    manager.queue = new UniqueJobQueue()
    manager
      .setStartAction(new StartScrapeAction(
        manager.startingUrl,
        manager.requeueCallback.bind(manager),
        manager.topLevelDomains))
      .setStopAction(new StopScrapeAction(manager, count))
    return manager
  }

  constructor (wait, startingUrl, topLevelDomains) {
    super(wait)
    this.startingUrl = !startingUrl ? 'https://www.ourcommons.ca/' : startingUrl
    this.topLevelDomains = !topLevelDomains ? ['https://www.ourcommons.ca/', 'https://www.parl.ca/'] : topLevelDomains
    this.shouldQueue = true
  }

  requeueCallback (jobs) {
    jobs.forEach(j => {
      try {
        this.queue.enqueue(j)
      } catch (e) {
        // ignore urls already in queue
      }
    })
  }

  async run () {
    await super.run()
    await this.finish()
  }

  async finish () {
    this.shouldQueue = false
    console.log('--------------------------------------------------------------------------------------------------------')
    console.log('INFO: Found the minimum (' + this.result.length + ') number of XML Links. No more requests will be queued, but connection errors will be re-tried.')
    console.log('--------------------------------------------------------------------------------------------------------')
    while (this.activeJobCount > 0) {
      this.logOutstandingJobs()
      await QueueManager.wait(10000)
    }
  }

  logOutstandingJobs () {
    console.log('INFO: Waiting for ' + this.activeJobCount + ' jobs to complete before processing xml links...')
  }
}

class ScrapeRunner {
  constructor (minimumFileCount, requestWaveInterval, startingUrl, domainScope) {
    this.manager = ScrapeJobManager.create(minimumFileCount, requestWaveInterval, startingUrl, domainScope)
  }

  getXmlContent () {
    require('events').EventEmitter.defaultMaxListeners = 1000
    return new Promise((resolve, reject) => {
      this.manager.execute()
        .then(result => {
          console.log(result)
        })
    })
  }
}

module.exports.ScrapeRunner = ScrapeRunner

console.debug = () => {}

new ScrapeRunner(50, '')
  .getXmlContent()

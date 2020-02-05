const QueueAction = require('../QueueAction').QueueAction
const ScrapeJob = require('../../../job/ScrapeJob').ScrapeJob

class StartScrapeAction extends QueueAction {
  constructor (url, callback, tlds) {
    super()
    this.first = ScrapeJob.create(url, callback, tlds)
  }

  async perform () {
    return this.first.execute()
  }
}

module.exports.StartScrapeAction = StartScrapeAction

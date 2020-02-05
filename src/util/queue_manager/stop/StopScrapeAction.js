const QueueAction = require('../QueueAction').QueueAction

class StopScrapeAction extends QueueAction {
  constructor (manager, maxLinkCount) {
    super()
    this.manager = manager
    this.count = maxLinkCount
  }

  perform () {
    this.manager.shouldQueue = this.manager.result.length < this.count
    return !this.manager.shouldQueue
  }
}

module.exports.StopScrapeAction = StopScrapeAction

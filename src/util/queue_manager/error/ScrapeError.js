const Action = require('@manager').QueueAction
const ScrapeError = require('../../action/error/errors').ScrapeError

class ScrapeErrorAction extends Action {
  constructor (manager) {
    super()
    this.manager = manager
  }

  async perform (e) {
    await this.manager.lock.acquire()
    this.manager.queryCount--
    this.manager.lock.release()
    if (!(e instanceof ScrapeError)) {
      throw e
    }
  }
}

module.exports.ScrapeErrorAction = ScrapeErrorAction

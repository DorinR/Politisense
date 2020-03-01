const Action = require('@manager').QueueAction
const ScrapeError = require('../../action/error/errors').ScrapeError

class ScrapeErrorAction extends Action {
  constructor (manager) {
    super()
    this.manager = manager
  }

  perform (e) {
    this.manager.queryCount--
    if (!(e instanceof ScrapeError)) {
      throw e
    }
  }
}

module.exports.ScrapeErrorAction = ScrapeErrorAction
const QueueAction = require('../QueueAction').QueueAction

class GenericStopAction extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
  }

  async perform () {
    await this.manager.lock.acquire()
    console.debug(`INFO: waiting on ${this.manager.queryCount - this.manager.result.length} results out of ${this.manager.queryCount} expected results`)
    const ret = this.manager.result.length >= this.manager.queryCount
    this.manager.lock.release()
    return ret
  }
}

module.exports = {
  GenericStopAction: GenericStopAction
}

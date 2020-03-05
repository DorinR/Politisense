const Action = require('./ThrowError').ThrowAction

class GenericErrorAction extends Action {
  constructor (manager, errorType) {
    super(manager)
    this.errorName = errorType.name
  }

  async perform (e) {
    await this.manager.lock.acquire()
    this.manager.queryCount--
    this.manager.lock.release()
    if (e.constructor.name === this.errorName) {
      throw e
    }
  }
}

module.exports.GenericErrorAction = GenericErrorAction

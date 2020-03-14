const QueueActions = require('../actions')
const QueueAction = QueueActions.QueueAction

class GenericStopAction extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
  }

  perform () {
    console.debug(`INFO: waiting on ${this.manager.queryCount - this.manager.result.length} results out of ${this.manager.queryCount} expected results`)
    return this.manager.result.length >= this.manager.queryCount
  }
}

module.exports = {
  GenericStopAction: GenericStopAction
}

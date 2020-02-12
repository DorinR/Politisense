const QueueActions = require('../actions')
const QueueAction = QueueActions.QueueAction

class RoleStopAction extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
  }

  perform () {
    return this.manager.result.length >= this.manager.queryCount
  }
}

module.exports = {
  RoleStop: RoleStopAction
}

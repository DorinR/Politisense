const QueueActions = require('../actions')
const QueueAction = QueueActions.QueueAction

class VoteStop extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
  }

  perform () {
    return this.manager.result.length >= this.manager.queryCount
  }
}

module.exports.VoteStop = VoteStop

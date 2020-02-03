const QueueActions = require('../actions')
const QueueAction = QueueActions.QueueAction

class PoliticianStop extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
    this.queryCount = this.manager.params.length + 1
  }

  perform () {
    return this.manager.result.length >= this.queryCount
  }
}

module.exports.PoliticianStop = PoliticianStop

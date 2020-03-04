const Action = require('../QueueAction').QueueAction

class ThrowAction extends Action {
  constructor(manager){
    super()
    this.manager = manager
  }
  async perform (e) {
    throw e
  }
}

module.exports.ThrowAction = ThrowAction

const Action = require('../QueueAction').QueueAction

class ThrowAction extends Action {
  async perform (e) {
    throw e
  }
}

module.exports.ThrowAction = ThrowAction

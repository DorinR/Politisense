const Action = require('../QueueAction').QueueAction

class VoteBeforeAction extends Action {
  constructor (manager) {
    super()
    this.manager = manager
  }

  perform () {

  }
}

module.exports = {
  VoteBefore: VoteBeforeAction
}
const QueueAction = require('../QueueAction').QueueAction

class UpdateStartAction extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
  }

  async perform () {
    console.log(`INFO: ${UpdateStartAction.name}: queueing level 0 updates (${this.manager.updateJobQueue[0].length} total)`)
    this.manager.queryCount = this.manager.updateJobQueue[0].length
    this.manager.updateJobQueue[0].forEach(job => {
      this.manager.queue.enqueue(job)
    })
    this.manager.updateJobQueue.shift()
  }
}

module.exports = {
  UpdateStartAction: UpdateStartAction
}

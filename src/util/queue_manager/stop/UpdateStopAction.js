const QueueAction = require('../QueueAction').QueueAction

class UpdateStopAction extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
    this.maxDepth = -1
  }

  perform () {
    return this.shouldStop()
  }

  async shouldStop () {
    if (this.maxDepth === -1) {
      this.maxDepth = this.manager.updateJobQueue.length
    }
    const done = this.manager.queue.size() === 0 && this.manager.result.length > 0
    if (done && this.manager.updateJobQueue.length !== 0) {
      console.log(`INFO: ${UpdateStopAction.name}: queueing level ${this.maxDepth - this.manager.updateJobQueue.length + 1} updates (${this.manager.updateJobQueue[0].length} total)`)
      this.manager.updateJobQueue[0].forEach(job => {
        this.manager.queue.enqueue(job)
      })
      this.manager.updateJobQueue.shift()
      return !done
    }
    return done
  }
}

module.exports = {
  UpdateStopAction: UpdateStopAction
}

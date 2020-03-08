const QueueAction = require('./GenericStopAction').GenericStopAction

class UpdateStopAction extends QueueAction {
  perform () {
    return this.shouldStop()
  }

  async shouldStop () {
    const done = this.manager.activeJobs.length === 0 && this.manager.result.length > 0
    if (done && this.manager.updateJobQueue.length !== 0) {
      console.log(`INFO: ${UpdateStopAction.name}: queueing level ${this.maxDepth++} updates (${this.maxDepth} total)`)
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

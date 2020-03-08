const QueueAction = require('../QueueAction').QueueAction
const ClassificationJob = require('../../../job/ClassificationJob').ClassificationJob

class ClassifyStart extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
  }

  async perform () {
    this.manager.params.forEach(param => {
      this.manager.queue.enqueue(
        ClassificationJob.create(
          param,
          this.manager.requeueCallback.bind(this.manager)
        )
      )
    })
  }
}

module.exports.ClassifyStart = ClassifyStart

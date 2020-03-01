const QueueAction = require('../QueueAction').QueueAction
const ClassificationJob = require('../../../job/ClassificationJob').ClassificationJob

class ClassifyStart extends QueueAction {
  constructor (manager) {
    super()
    manager.params.forEach(param => {
      manager.queue.enqueue(
        ClassificationJob.create(
          param,
          manager.requeueCallback.bind(manager)
        )
      )
    })
  }

  async perform () {
    return null
  }
}

module.exports.ClassifyStart = ClassifyStart
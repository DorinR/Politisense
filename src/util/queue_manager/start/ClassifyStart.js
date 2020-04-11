const QueueAction = require('./GenericStartAction').GenericStartAction
const ClassificationJob = require('../../../job/ClassificationJob').ClassificationJob

class ClassifyStart extends QueueAction {
  constructor (manager) {
    super(manager, ClassificationJob)
  }
}

module.exports.ClassifyStart = ClassifyStart

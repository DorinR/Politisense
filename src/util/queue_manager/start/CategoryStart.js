const QueueAction = require('./GenericStartAction').GenericStartAction
const CategoryGenerationJob = require('../../../job/CategoryGenerationJob').CategoryGenerationJob

class CategoryStart extends QueueAction {
  constructor (manager) {
    super(manager, CategoryGenerationJob)
  }
}

module.exports.CategoryStart = CategoryStart

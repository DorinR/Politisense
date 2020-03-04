const QueueAction = require('../QueueAction').QueueAction
const Job = require('../../Job').AbstractJob
const ActionDecorationError = require('@action').Errors.ActionDecorationError

class GenericStartAction extends QueueAction {
  constructor(manager, type) {
    super()
    this.manager = manager
    if(type.__proto__.name !== 'Job') {
      throw new ActionDecorationError(type)
    }
    this.create = type.create
  }

  async perform () {
    this.manager.params.forEach(param => {
      this.manager.queue.enqueue(
        this.create(param, this.manager.requeueCallback.bind(this.manager))
      )
    })
  }
}

module.exports = {
  GenericStartAction: GenericStartAction
}
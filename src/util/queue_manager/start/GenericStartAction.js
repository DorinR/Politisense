const QueueAction = require('../QueueAction').QueueAction
const ActionDecorationError = require('@action').Errors.ActionDecorationError

class GenericStartAction extends QueueAction {
  constructor (manager, type) {
    super()
    this.manager = manager
    // eslint-disable-next-line no-proto
    if (type.__proto__.name !== 'Job') {
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

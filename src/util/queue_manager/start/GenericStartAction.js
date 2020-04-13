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
    this.type = type
  }

  async perform () {
    console.log(`INFO: ${this.type.name}: initial ${this.manager.params.length} queries enqueued`)
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

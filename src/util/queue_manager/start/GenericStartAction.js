const QueueAction = require('../QueueAction').QueueAction

class GenericStartAction extends QueueAction {
  constructor(manager, type) {
    super()
    this.manager = manager
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
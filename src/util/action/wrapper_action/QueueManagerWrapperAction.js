const QueueManager = require('../../queue_manager/QueueManager').QueueManager
const DecorationError = require('../error/errors').ActionDecorationError
const Action = require('../JobAction').AbstractJobAction

class QueueManagerWrapperAction extends Action {
  constructor (QueueManagerType, params) {
    super()
    if (typeof QueueManagerType !== typeof QueueManager) {
      throw new DecorationError(QueueManagerType)
    }
    this.create = QueueManagerType.create
    this.wrapped =  'Wrapped ' + QueueManagerType.name
    this.params = params
  }

  async perform (params) {
    if (params) {
      this.params = params
    }

    const manager = this.create(this.params)
    return manager.execute()
  }
}

module.exports.QueueManagerWrapperAction = QueueManagerWrapperAction

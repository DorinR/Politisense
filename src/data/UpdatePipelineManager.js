require('module-alias/register')
const QueueManager = require('../../util/queue_manager/QueueManager').QueueManager
const BeforeAction = require('../../util/queue_manager/before/')
const StartAction = require('../../util/queue_manager/start/')
const StopAction = require('../../util/queue_manager/stop/')
const Throw = require('../../util/queue_manager/error/')
const InvalidParameterError = require('./error/InvalidParameterError').InvalidParameterError

class UpdatePipelineManager extends QueueManager {
  static create(param, wait = 30000) {
    const manager = new UpdatePipelineManager(param, wait)
    manager
      .setBeforeAction()
      .setStartAction()
      .setStopAction()
      .setAfterAction()
      .setErrorAction()
    return manager
  }

  constructor (param, wait = 30000) {
    super(wait)
    if(!(param instanceof String)) {
      throw new InvalidParameterError(`ERROR: parameter ${param} is not a string`)
    }
    if(!Updates.includes(param)) {
      throw new InvalidParameterError(`ERROR: parameter ${param} is not a valid update`)
    }
    this.params = param
    this.queryCount = 1
  }

}

module.exports = {
  UpdatePipelineManager: UpdatePipelineManager,
  Update: Updates
}
require('module-alias/register')
const QueueManager = require('../util/queue_manager/QueueManager').QueueManager
const StartAction = require('../util/queue_manager/start/UpdateStartAction').UpdateStartAction
const StopAction = require('../util/queue_manager/stop/GenericStopAction').GenericStopAction
const Throw = require('../util/queue_manager/error/ThrowError').ThrowAction
const InvalidParameterError = require('./error/InvalidParameterError').InvalidParameterError
const Parameters = require('@parameter')

class UpdatePipelineManager extends QueueManager {
  static create(param, wait = 30000) {
    const manager = new UpdatePipelineManager(param, wait)
    manager
      .setStartAction(new StartAction(manager))
      .setStopAction(new StopAction(manager))
      .setErrorAction(new Throw(manager))
    return manager
  }

  constructor (param, wait = 30000) {
    super(wait)
    if(!(typeof param === 'string')) {
      throw new InvalidParameterError(`ERROR: parameter ${param} is not a string`)
    }
    if(!Object.values(Parameters.UpdateNode).includes(param)) {
      throw new InvalidParameterError(`ERROR: parameter ${param} is not a valid update`)
    }
    this.params = param
    this.queryCount = 1
  }

}

module.exports = {
  UpdatePipelineManager: UpdatePipelineManager,
}

UpdatePipelineManager
  .create(Parameters.UpdateNode.Role)
  .execute()
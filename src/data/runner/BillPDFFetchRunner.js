require('module-alias/register')
const QueueManager = require('../../util/queue_manager/QueueManager').QueueManager
const QueueAction = require('../../util/queue_manager/QueueAction').QueueAction
const StartAction = require('../../util/queue_manager/start/BillPDFFetchStart').BillPDFFetchStartAction
const StopAction = require('../../util/queue_manager/stop/GenericStopAction').GenericStopAction
const Throw = require('../../util/queue_manager/error/ScrapeError').ScrapeErrorAction

class LogAction extends QueueAction {
  perform(result) {
    console.log(`INFO: found result for ${result.params.url}`)
    return result
  }
}

class BillPDFFetchRunner extends QueueManager {
  static create(params, wait = 5000) {
    const manager = new BillPDFFetchRunner(params, wait)
    manager
      .setStartAction(new StartAction(manager))
      .setStopAction(new StopAction(manager))
      .setErrorAction(new Throw(manager))
      .setLogAction(new LogAction())
    return manager
  }

  constructor (params, wait = 5000) {
    super(wait)
    this.params = params
    this.queryCount = params.length
  }

  accumulate (result) {
    if(result) {
      this.result.push(result)
    }
    return result
  }
}

module.exports.BillPDFFetchRunner = BillPDFFetchRunner

require('module-alias/register')
const QueueManager = require('../../util/queue_manager/QueueManager').QueueManager
const QueueAction = require('../../util/queue_manager/QueueAction').QueueAction
const StartAction = require('../../util/queue_manager/start/BillPDFFetchStart').BillPDFFetchStartAction
const StopAction = require('../../util/queue_manager/stop/GenericStopAction').GenericStopAction
const Throw = require('../../util/queue_manager/error/ScrapeError').ScrapeErrorAction

class LogAction extends QueueAction {
  constructor (manager, type) {
    super()
    this.manager = manager
    this.type = type
  }

  perform (result) {
    if (result) {
      console.log(`INFO: ${this.type.name}: found result for ${result.id}`)
    }
    return result
  }
}

class BillPDFFetchRunner extends QueueManager {
  static create (params, wait = 5000) {
    const manager = new BillPDFFetchRunner(params, wait)
    manager
      .setStartAction(new StartAction(manager))
      .setStopAction(new StopAction(manager))
      .setErrorAction(new Throw(manager))
      .setLogAction(new LogAction(manager, BillPDFFetchRunner))
    return manager
  }

  constructor (params, wait = 5000) {
    super(wait)
    this.params = params
    this.queryCount = params.length
    this.maxQueryCount = this.queryCount
  }

  accumulate (result) {
    if (result) {
      this.result.push(result)
    }
    return result
  }

  async run () {
    await super.run()
    this.finish()
  }

  finish () {
    console.log(`INFO: ${BillPDFFetchRunner.name}: Data found for ${this.queryCount}/${this.maxQueryCount} queries from passed params`)
  }
}

module.exports.BillPDFFetchRunner = BillPDFFetchRunner

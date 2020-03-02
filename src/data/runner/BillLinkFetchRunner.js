require('module-alias/register')
const QueueManager = require('../../util/queue_manager/QueueManager').QueueManager
const BeforeAction = require('../../util/queue_manager/before/BillLinkFetchBefore').BillLinkFetchBeforeAction
const StartAction = require('../../util/queue_manager/start/BillLinkStart').BillLinkStart
const StopAction = require('../../util/queue_manager/stop/GenericStopAction').GenericStopAction
const Throw = require('../../util/queue_manager/error/ScrapeError').ScrapeErrorAction

class BillLinkFetchRunner extends QueueManager {
  static create (params, wait = 5000) {
    const manager = new BillLinkFetchRunner(params, wait)
    manager
      .setBeforeAction(new BeforeAction(manager))
      .setStartAction(new StartAction(manager))
      .setStopAction(new StopAction(manager))
      .setErrorAction(new Throw(manager))
    return manager
  }

  constructor (params, wait = 5000) {
    super(wait)
    if (!params.parliaments || params.parliaments === 'all') {
      this.parliaments = [36, 37, 38, 39, 40, 41, 42, 43]
    } else if (params.parliaments instanceof Array) {
      this.parliaments = params.parliaments
    } else {
      throw new Error('ERROR: no parliaments specified')
    }
    this.params = this.parliaments.map(parl => {
      return {
        parliament: parl
      }
    })
  }

  accumulate (result) {
    if (result) {
      this.result.push(result)
    }
    return result
  }
}

module.exports.BillLinkFetchRunner = BillLinkFetchRunner

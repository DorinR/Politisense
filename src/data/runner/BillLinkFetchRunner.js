require('module-alias/register')
const QueueManager = require('../../util/queue_manager/QueueManager').QueueManager
const BeforeAction = require('../../util/queue_manager/before/BillLinkFetchBefore').BillLinkFetchBeforeAction
const StartAction = require('../../util/queue_manager/start/BillLinkStart').BillLinkStart
const StopAction = require('../../util/queue_manager/stop/GenericStopAction').GenericStopAction
const LogAction = require('../../util/queue_manager/log/TypedLogAction').TypedLogAction
const Throw = require('../../util/queue_manager/error/ScrapeError').ScrapeErrorAction

const Parameters = require('@parameter')

class BillLinkFetchRunner extends QueueManager {
  static create (params, wait = 5000) {
    const manager = new BillLinkFetchRunner(params, wait)
    manager
      .setBeforeAction(new BeforeAction(manager))
      .setStartAction(new StartAction(manager))
      .setStopAction(new StopAction(manager))
      .setErrorAction(new Throw(manager))
      .setLogAction(new LogAction(BillLinkFetchRunner))
    return manager
  }

  constructor (params, wait = 5000) {
    super(wait)
    if (!params.parliaments || params.parliaments === 'all') {
      this.parliaments = Parameters.Parliament.Number
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
    this.queryCount = this.params.length
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
    console.log(`INFO: ${BillLinkFetchRunner.name}: Data found for ${this.queryCount}/${this.maxQueryCount} queries from passed params`)
  }
}

module.exports.BillLinkFetchRunner = BillLinkFetchRunner

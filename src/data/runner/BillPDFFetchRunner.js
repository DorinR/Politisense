require('module-alias/register')
const QueueManager = require('../../util/queue_manager/QueueManager').QueueManager
const StartAction = require('../../util/queue_manager/start/BillPDFFetchStart').BillPDFFetchStartAction
const StopAction = require('../../util/queue_manager/stop/GenericStopAction').GenericStopAction
const Throw = require('../../util/queue_manager/error/ScrapeError').ScrapeErrorAction
const LogAction = require('../../util/queue_manager/log/TypedLogAction').TypedLogAction

const InvalidParameterError = require('../error/errors').InvalidParameterError
const Parameters = require('@parameter')

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
    if (!params[0].url) {
      throw new InvalidParameterError('ERROR: no url to bill pdf provided')
    }
    if (!params[0].id) {
      throw new InvalidParameterError('ERROR: no bill ID for provided url')
    }
    if (!params[0].parliament || (params[0].parliament && !Parameters.Parliament.Number.includes(params[0].parliament))) {
      throw new InvalidParameterError('ERROR: no parliament or invalid provided for bill ID and url')
    }

    this.params = params
    this.queryCount = params.length
    this.maxQueryCount = this.queryCount
  }

  finish () {
    console.log(`INFO: ${BillPDFFetchRunner.name}: Data found for ${this.queryCount}/${this.maxQueryCount} queries from passed params`)
  }
}

module.exports.BillPDFFetchRunner = BillPDFFetchRunner

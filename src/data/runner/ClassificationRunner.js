require('module-alias/register')
const Components = require('@manager')
const InvalidParameterError = require('../error/errors').InvalidParameterError

class ClassificationRunner extends Components.QueueManager {
  static create (params, wait = 30000) {
    const manager = new ClassificationRunner(params, wait)
    manager
      .setStartAction(new Components.Start.Classify(manager))
      .setStopAction(new Components.Stop.Generic(manager))
      .setErrorAction(new Components.Error.Throw(manager))
      .setLogAction(new Components.Log.Typed(ClassificationRunner))
    return manager
  }

  finish () {
    console.log(`INFO: ${ClassificationRunner.name}: Data found for ${this.queryCount}/${this.maxQueryCount} queries from passed params`)
  }

  constructor (params, wait = 30000) {
    super(wait)
    if (!(params instanceof Object)) {
      throw new InvalidParameterError('ERROR: parameter must be an object')
    }
    if (!params.parliaments) {
      throw new InvalidParameterError('ERROR: parameter object must contain parliament information')
    }

    this.params = [params]
    this.queryCount = this.params.length
    this.maxQueryCount = this.queryCount
  }
}

module.exports.ClassificationRunner = ClassificationRunner

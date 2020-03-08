require('module-alias/register')
const Components = require('@manager')

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
    console.log(`INFO: ${ClassificationRunner.name}: Data found for ${this.queryCount}/${this.maxQueryCount} queries from passed params`)
  }

  constructor (params, wait = 30000) {
    super(wait)
    this.params = [params]
    this.queryCount = this.params.length
    this.maxQueryCount = this.queryCount
  }
}

module.exports.ClassificationRunner = ClassificationRunner

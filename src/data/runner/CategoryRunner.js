require('module-alias/register')
const Components = require('@manager')
const Parameters = require('@parameter')

class CategoryRunner extends Components.QueueManager {
  static create (params, wait = 30000) {
    const manager = new CategoryRunner(params, wait)
    manager
      .setStartAction(new Components.Start.Category(manager))
      .setStopAction(new Components.Stop.Generic(manager))
      .setErrorAction(new Components.Error.Throw(manager))
      .setLogAction(new Components.Log.Typed(CategoryRunner))
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
    console.log(`INFO: ${CategoryRunner.name}: Data found for ${this.queryCount}/${this.maxQueryCount} queries from passed params`)
  }

  constructor (params, wait = 30000) {
    super(wait)
    this.params = Parameters.Parliament.Number.map(parliament => {
      return { parliament: parliament }
    })
    this.queryCount = this.params.length
    this.maxQueryCount = this.queryCount
  }
}

module.exports.CategoryRunner = CategoryRunner
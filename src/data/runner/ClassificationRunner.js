require('module-alias/register')
const Utils = require('@utils')
const QueueManager = Utils.QueueManager.QueueManager
const StartAction = Utils.QueueManager.Start.Classify
const StopAction = Utils.QueueManager.Stop.GenericStopAction
const Throw = Utils.QueueManager.Error.Throw

class ClassificationRunner extends QueueManager {
  static create(params, wait = 30000) {
    const manager = new ClassificationRunner(params, wait)
    manager
      .setStartAction(new StartAction(manager))
      .setStopAction(new StopAction(manager))
      .setErrorAction(new Throw(manager))
    return manager
  }

  accumulate(result) {
    if (result) {
      this.result.push(result)
    }
    return result
  }

  constructor(params, wait = 30000) {
    super(wait)
    this.params = [params]
    this.queryCount = this.params.length
  }
}

module.exports.ClassificationRunner = ClassificationRunner

ClassificationRunner.create({
  parliaments: 'all'
})
  .execute()
  .then(results => {
    //console.log(results)
  })
  .catch(console.error)

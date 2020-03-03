const QueueAction = require('../QueueAction').QueueAction
const PoliticianFetchJob = require('../../../job/PoliticianFetchJob').PoliticianFetchJob

class PoliticianStart extends QueueAction {
  constructor (manager) {
    super()
    manager.params.forEach(param => {
      manager.queue.enqueue(
        PoliticianFetchJob.create(
          param,
          manager.requeueCallback.bind(manager)
        )
      )
    })
  }

  async perform () {
    return null
  }
}

module.exports.PoliticianStart = PoliticianStart

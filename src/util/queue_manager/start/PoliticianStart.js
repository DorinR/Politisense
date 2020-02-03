const QueueActions = require('../actions')
const QueueAction = QueueActions.QueueAction
const PoliticianFetchJob = require('../../../job/jobs').PoliticianFetchJob

class PoliticianStart extends QueueAction {
  constructor (manager) {
    super()
    this.first = PoliticianFetchJob.create(
      manager.params.shift(),
      manager.requeueCallback.bind(manager)
    )
    manager.params.forEach(param => {
      manager.queue.enqueue(
        PoliticianFetchJob.create(
          param,
          manager.requeueCallback.bind(manager)
        )
      )
    })
  }

  perform () {
    return this.first.execute()
  }
}

module.exports.PoliticianStart = PoliticianStart

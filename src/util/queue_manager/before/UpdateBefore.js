const QueueAction = require('../QueueAction').QueueAction
const Job = require('../../../job/Job').AbstractJob
const Firestore = require('@firestore').Firestore

const Data = require('@parameter')
const Scrapers = Data.Scrapers
const Runners = Data.Runners
const Actions = require('@action')
const UpdateGraph = require('../../../data/UpdateDependencyGraph').UpdateDependencyGraph
const Parameters = Data.Parameters

class UpdateBeforeAction extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
    this.updates = new UpdateGraph().orderedUpdates(manager.params)
    this.params = {
      parliaments: Parliaments,
      sessions:0,
    }
  }

  static

  async perform () {

  }
}

module.exports = {
  UpdateBeforeAction: UpdateBeforeAction
}
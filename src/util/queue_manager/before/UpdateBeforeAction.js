const QueueAction = require('../QueueAction').QueueAction
const QueueManager = require('../QueueManager').QueueManager
const Jobs = require('@jobs')
const QueueManagerWrapperAction = require('../../action/wrapper_action/QueueManagerWrapperAction').QueueManagerWrapperAction
const UpdateGraph = require('../../../data/UpdateDependencyGraph').UpdateDependencyGraph
const Parameters = require('@parameter')

class UpdateBeforeAction extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
    this.updates = new UpdateGraph().orderedUpdates(manager.params)
  }

  async perform () {
    let currentDepth
    let index = 0
    console.log(`INFO: ${UpdateBeforeAction.name}: structuring ${this.updates.length} requested updates`)
    this.updates.forEach(({ vertex, depth }) => {
      const update = vertex
      const params = UpdateBeforeAction.createParams(update)
      const job = new Jobs.Job(params, this.manager.requeueCallback.bind(this.manager))
      if (!currentDepth) {
        this.manager.updateJobQueue.push([])
        currentDepth = depth
      }
      if (depth !== currentDepth) {
        index++
        this.manager.updateJobQueue.push([])
        currentDepth = depth
      }
      if (depth === currentDepth) {
        UpdateBeforeAction.addActions(job, params, vertex)
      }
      this.manager.updateJobQueue[index].push(job)
    })
    console.log(`INFO: ${UpdateBeforeAction.name}: structured updates into ${this.manager.updateJobQueue.length} phases`)
  }

  static createParams (vertex) {
    const params = {
      parliaments: Object.assign(Parameters.Parliament.Number),
      sessions: Object.assign(Parameters.Parliament.Session),
      parliamentSessions: 'all'
    }
    params.url = vertex.data.url
    params.collection = vertex.data.collection
    return params
  }

  static addActions (job, params, update) {
    // eslint-disable-next-line new-cap
    const typeCheck = new update.type(params)
    if (typeCheck instanceof QueueManager) {
      job.addAction(new QueueManagerWrapperAction(update.type, params))
    } else {
      throw new Error('ERROR: Invalid update type')
    }
    console.log(`INFO: ${UpdateBeforeAction.name}: Added update job using ${update.type.name}`)
  }
}

module.exports = {
  UpdateBeforeAction: UpdateBeforeAction
}

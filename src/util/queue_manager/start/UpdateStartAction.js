const QueueAction = require('../QueueAction').QueueAction
const QueueManager = require('../QueueManager').QueueManager
const Jobs = require('@jobs')
const Actions = require('@action')
const QueueManagerWrapperAction = require('../../action/wrapper_action/QueueManagerWrapperAction').QueueManagerWrapperAction
const UpdateGraph = require('../../../data/UpdateDependencyGraph').UpdateDependencyGraph
const Parameters = require('@parameter')

class UpdateStartAction extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
    this.updates = new UpdateGraph().orderedUpdates(manager.params)
    this.params = {
      parliaments: Parameters.Parliament.Number,
      sessions: Parameters.Parliament.Session,
      parliamentSessions: Parameters.VoteParameters.Parliament
    }
  }

  async perform () {
    const pipelineJob = new Jobs.Job(this.params, this.manager.requeueCallback.bind(this.manager))
    this.updates
      .filter(update => {
        return update.type !== Parameters.UpdateNode.All && update.type !== Parameters.UpdateNode.None
      })
      .forEach(update => {
        const params = Object.assign(this.params)
        params.url = update.data.url
        params.collection = update.data.collection
        if(new update.type(params) instanceof QueueManager) {
          pipelineJob.addAction(new QueueManagerWrapperAction(update.type, params))
        } else if (new update.type(params) instanceof Actions.Action){
          pipelineJob.addAction(new update.type())
        } else {
          throw new Error('ERROR: Invalid update type')
        }
    })
    this.manager.queue.enqueue(pipelineJob)
  }
}

module.exports = {
  UpdateStartAction: UpdateStartAction
}
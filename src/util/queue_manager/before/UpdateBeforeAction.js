const QueueAction = require('../QueueAction').QueueAction
const QueueManager = require('../QueueManager').QueueManager
const Jobs = require('@jobs')
const QueueManagerWrapperAction = require('../../action/wrapper_action/QueueManagerWrapperAction').QueueManagerWrapperAction
const UpdateGraph = require('../../../data/update/UpdateDependencyGraph').UpdateDependencyGraph
const Parameters = require('@parameter')
const InsertAction = require('../../action/classify_action/UpdateCollectionAction').UpdateCollectionAction

class UpdateBeforeAction extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
    this.updates = new UpdateGraph().orderedUpdates(manager.params)
  }

  async perform () {
    let currentDepth = -1
    let index = 0
    this.manager.params = []
    console.log(`INFO: ${UpdateBeforeAction.name}: structuring ${this.updates.length} requested updates`)
    this.updates.forEach(({ vertex, depth }) => {
      const update = vertex
      const params = UpdateBeforeAction.createParams(update)
      this.manager.params.push(params)
      const job = new Jobs.Job(params, this.manager.requeueCallback.bind(this.manager))
      if (currentDepth === -1) {
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
      let smallerParams
      if(vertex.type.name === 'RoleScraper' || vertex.type.name === 'VoteParticipantScraper') {
        smallerParams = params.parliaments.map(parliament => {
          return {
            sessions: params.sessions,
            parliaments: [parliament],
            parliamentSessions: params.parliamentSessions,
            url: params.url,
            collection: params.collection
          }
        })
      }
      if(vertex.type.name === 'ExpenditureScraper') {
        smallerParams = params.years.map(year => {
          return {
            sessions: params.sessions,
            parliaments: Parameters.ExpenditureParameters.YearToParliament[year],
            parliamentSessions: params.parliamentSessions,
            url: params.url,
            collection: params.collection,
            years: [year]
          }
        })
      }
      if(vertex.type.name === 'ExpenditureScraper' ||
         vertex.type.name === 'RoleScraper' ||
         vertex.type.name === 'VoteParticipantScraper') {
        const jobs = smallerParams.map(param => {
          const job = new Jobs.Job(param, this.manager.requeueCallback.bind(this.manager))
          UpdateBeforeAction.addActions(job, param, vertex)
          return job
        })
        this.manager.updateJobQueue[index].push(...jobs)
      } else {
        this.manager.updateJobQueue[index].push(job)
      }

    })
    console.log(`INFO: ${UpdateBeforeAction.name}: structured updates into ${this.manager.updateJobQueue.length} phases`)
  }

  static createParams (vertex) {
    const params = {
      parliaments: Object.assign(Parameters.Parliament.Number),
      sessions: Object.assign(Parameters.Parliament.Session),
      parliamentSessions: Object.assign(Parameters.Parliament.Session),
      years: Object.values(Parameters.ExpenditureParameters.Year)
    }
    params.url = vertex.data.url
    params.collection = vertex.data.collection
    return params
  }

  static addActions (job, params, update) {
    // eslint-disable-next-line new-cap
    const typeCheck = new update.type(params)
    if (typeCheck instanceof QueueManager) {
      job
        .addAction(new QueueManagerWrapperAction(update.type, params))
        .addAction(new InsertAction(params))
    } else {
      throw new Error('ERROR: Invalid update type')
    }
    console.log(`INFO: ${UpdateBeforeAction.name}: Added update job using ${update.type.name}`)
  }
}

module.exports = {
  UpdateBeforeAction: UpdateBeforeAction
}

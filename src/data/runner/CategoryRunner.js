require('module-alias/register')
const Components = require('@manager')
const Parameters = require('@parameter')
const InvalidParameterError = require('../error/errors').InvalidParameterError

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

  finish () {
    console.log(`INFO: ${CategoryRunner.name}: Data found for ${this.queryCount}/${this.maxQueryCount} queries from passed params`)
  }

  constructor (params, wait = 30000) {
    super(wait)
    if(typeof params.parliaments === 'undefined' || (typeof params.parliaments === 'string' && params.parliaments === 'all')) {
      this.params = Parameters.Parliament.Number.map(parliament => {
        return { parliament: parliament }
      })
    }else if(Array.isArray(params.parliaments)) {
      this.params = params.parliaments.map(parliament => {
        return { parliament: parliament }
      })
    }else {
      throw new InvalidParameterError('ERROR: invalid parameter object provided')
    }
    this.queryCount = this.params.length
    this.maxQueryCount = this.queryCount
  }
}

module.exports.CategoryRunner = CategoryRunner

const Firestore = require('@firestore').Firestore

  CategoryRunner
    .create(Parameters.Parliament.Number)
    .execute()
    .then(results => {
      return Promise.all(results.map(result => {
        const parliament = result.params.parliament
        return Promise.all(result.data.map(category => {
          return new Firestore(false)
            .forParliament(parliament)
            .BillClassification()
            .insert(category)
        }))
      }))
    })
    .then(async responses => {
      console.log(responses)
    })




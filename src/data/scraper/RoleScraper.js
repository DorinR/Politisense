require('module-alias/register')
const Components = require('@manager')
const Parameters = require('@parameter')

class RoleScraper extends Components.QueueManager {
  static create (params, wait = 5000) {
    const manager = new RoleScraper(params, wait)
    manager
      .setBeforeAction(new Components.Before.Role(manager))
      .setStartAction(new Components.Start.Role(manager))
      .setStopAction(new Components.Stop.Generic(manager))
      .setErrorAction(new Components.Error.Parse(manager))
      .setLogAction(new Components.Log.Typed(RoleScraper))
    return manager
  }

  constructor (params, wait = 5000) {
    super(wait)
    this.parliaments = []
    this.setParliaments(params.parliaments)
    this.params = []
    this.createQueries(params.url)
    this.queryCount = 0
    this.maxQueryCount = 0
  }

  finish () {
    console.log(`INFO: ${RoleScraper.name}: Data found for ${this.queryCount}/${this.maxQueryCount} queries from passed params`)
  }

  setParliaments (parliaments) {
    if (typeof parliaments === 'undefined' ||
      (typeof parliaments === typeof ' ' && parliaments.toLowerCase().includes('all'))) {
      this.parliaments.push(...Parameters.Parliament.Number)
    } else if (typeof parliaments === typeof []) {
      this.parliaments = parliaments.filter(parliament => {
        return parliament >= 36
      })
    }
  }

  createQueries (url) {
    this.parliaments.forEach(parl => {
      this.params.push({
        url: url,
        params: {
          parliament: parl
        }
      })
    })
  }
}

module.exports = {
  RoleScraper: RoleScraper
}

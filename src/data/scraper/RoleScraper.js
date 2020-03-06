require('module-alias/register')
const Components = require('@manager')

class RoleScraper extends Components.QueueManager {
  static create (params, wait = 5000) {
    const manager = new RoleScraper(params, wait)
    manager
      .setBeforeAction(new Components.Before.Role(manager))
      .setStartAction(new Components.Start.Role(manager))
      .setStopAction(new Components.Stop.Generic(manager))
      .setErrorAction(new Components.Error.Parse(manager))
      .setLogAction(new Components.Log.Generic(manager))
    return manager
  }

  constructor (params, wait = 5000) {
    super(wait)
    this.parliaments = []
    this.setParliaments(params.parliaments)
    this.params = []
    this.createQueries(params.url)
  }

  accumulate (result) {
    if (result) {
      this.result.push(result)
    }
    return result
  }

  setParliaments (parliaments) {
    if (typeof parliaments === 'undefined' ||
      (typeof parliaments === typeof ' ' && parliaments.toLowerCase().includes('all'))) {
      this.parliaments.push(...[35, 36, 37, 38, 39, 40, 41, 42, 43])
    } else if (typeof parliaments === typeof []) {
      this.parliaments = parliaments.filter(parliament => {
        return parliament >= 35
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

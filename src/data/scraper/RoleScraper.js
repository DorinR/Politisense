require('module-alias/register')
const Utils = require('@utils')
const QueueManager = Utils.QueueManager.QueueManager
const StartAction = Utils.QueueManager.Start.StartRoleScrape
const StopAction = Utils.QueueManager.Stop.StopRoleScrape
const Throw = Utils.QueueManager.Error.ParseErrorAction

class RoleScraper extends QueueManager {
  static create (params, wait = 5000) {
    const manager = new RoleScraper(params, wait)
    manager
      .setStartAction(new StartAction(manager))
      .setStopAction(new StopAction(manager))
      .setErrorAction(new Throw(manager))
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

RoleScraper.create({
  url: 'https://www.ourcommons.ca/Members/en/search',
  parliaments: 'all'
})
  .execute()
  .then(result => {
    console.log(result)
  })
  .catch(console.error)

const QueueAction = require('./GenericStartAction').GenericStartAction
const PoliticianFetchJob = require('../../../job/PoliticianFetchJob').PoliticianFetchJob

class PoliticianStart extends QueueAction {
  constructor (manager) {
    super(manager, PoliticianFetchJob)
  }
}

module.exports.PoliticianStart = PoliticianStart

require('module-alias/register')
const Utils = require('@utils')
const QueueManager = Utils.QueueManager.QueueManager
const StartAction = Utils.QueueManager.Start.StartPoliticianScrape
const StopAction = Utils.QueueManager.Stop.StopPoliticianScrape
const Throw = Utils.QueueManager.Error.ParseErrorAction

const BillType = {
  houseGovernment: 3,
  privateMember: 4,
  senateGovernment: 80759,
  senatePublic: 80760,
  senatePrivate: 80761
}

const Result = {
  agreedTo: 15,
  negatived: 16,
  tie: 17
}

class VoteScraper extends QueueManager {
  static create (params, wait = 5000) {
    const manager = new VoteScraper(params, wait)
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
    this.billTypes = []
    this.billTypes(params.billTypes)
    this.results = []
    this.results(params.results)
    this.dateRanges = []
    this.dateRanges(params.dateRanges)

    this.params = []
    this.createQueries(params.url)
    this.queryCount = this.params.length
    this.maxQueryCount = this.queryCount
  }

  async run () {
    await super.run()
    this.finish()
  }

  accumulate (result) {
    this.result.push(result)
    return result
  }

  setParliaments (parliaments) {

  }

  setBillTypes (billTypes) {

  }

  setResults (results) {

  }

  setDateRanges (dateRanges) {

  }

  createQueries (url) {

  }
}

module.exports.VoteScraper = VoteScraper

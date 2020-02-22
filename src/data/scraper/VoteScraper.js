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
    this.setBillTypes(params.billTypes)
    this.results = []
    this.setResults(params.results)
    this.dateRanges = []
    this.setDateRanges(params.dateRanges)
    // TODO: ADD billDocumentId

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
    // TODO: votes uses weird form of parliament
  }

  setBillTypes (billTypes) {
    if (typeof billTypes === 'undefined' ||
      (typeof billTypes === typeof ' ' && billTypes.toLowerCase().includes('all'))) {
      this.billTypes.push(undefined)
    }
    if (typeof billTypes === typeof []) {
      const validBillTypes = Object.values(BillType)
      this.billTypes = billTypes.filter(type => {
        return validBillTypes.includes(type)
      })
    }
  }

  setResults (results) {
    if (typeof results === 'undefined' ||
      (typeof results === typeof ' ' && results.toLowerCase().includes('all'))) {
      this.results.push(undefined)
    }
    if (typeof results === typeof []) {
      const validResult = Object.values(Result)
      this.results = results.filter(type => {
        return validResult.includes(type)
      })
    }
  }

  setDateRanges (dateRanges) {
    if (typeof dateRanges === 'undefined' ||
      (typeof dateRanges === typeof ' ' && dateRanges.toLowerCase().includes('all'))) {
      this.dateRanges.push(undefined)
    }
    if (typeof dateRanges === typeof []) {
      this.dateRanges = dateRanges.filter(dateRange => {
        return this.isValidDateRange(dateRange)
      })
    }
  }

  isValidDateRange (dateRange) {
    if (typeof dateRange !== typeof [] || dateRange.length !== 2) {
      return false
    }

    for (const date in dateRange) {
      if (!this.isValidDate(date)) {
        return false
      }
    }

    return true
  }

  isValidDate (date) {
    if (typeof date !== typeof '') {
      return false
    }
    const dateAsArray = date.split('-')
    if (dateAsArray.length !== 3 || dateAsArray.some(el => typeof el !== 'number')) {
      return false
    }
    return true
  }

  createQueries (url) {

  }
}

module.exports.VoteScraper = VoteScraper

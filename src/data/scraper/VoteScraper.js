require('module-alias/register')
const Components = require('@manager')
const flatten = require('flat')
const Parameters = require('@parameter')

class VoteScraper extends Components.QueueManager {
  static create(params, wait = 5000) {
    const manager = new VoteScraper(params, wait)
    manager
      .setStartAction(new Components.Start.VoteRecord(manager))
      .setStopAction(new Components.Stop.Generic(manager))
      .setAfterAction(new Components.After.Vote(manager))
      .setErrorAction(new Components.Error.Parse(manager))
      .setLogAction(new Components.Log.Typed(VoteScraper))
    return manager
  }

  constructor(params, wait = 5000) {
    super(wait)
    this.parliamentSessions = []
    this.createParliamentSessions(params.parliamentSessions)
    this.billDocumentTypes = []
    this.createBillDocumentTypes(params.types)
    this.voteResults = []
    this.createVoteResults(params.voteResults)
    this.motionPrefixes = []
    this.createMotionPrefixes(params.topics)
    this.params = []
    this.createParams(params.url)
    this.queryCount = this.params.length
    this.maxQueryCount = this.queryCount
  }

  finish() {
    console.log(`INFO: ${VoteScraper.name}: Data found for ${this.queryCount}/${this.maxQueryCount} queries from passed params`)
  }

  createParliamentSessions(parliamentSessions) {
    const validEntries = Object.values(flatten(Parameters.VoteParameters.Parliament))
    if (!parliamentSessions || parliamentSessions === 'all' || !Array.isArray(parliamentSessions)) {
      this.parliamentSessions = validEntries
    } else if (Array.isArray(parliamentSessions)) {
      this.parliamentSessions = parliamentSessions.filter(parl => {
        return validEntries.includes(parl)
      })
    }
  }

  createBillDocumentTypes(types) {
    const validEntries = Object.values(flatten(Parameters.VoteParameters.Type))
    if (!types || types === 'all' || !Array.isArray(types)) {
      this.billDocumentTypes = ['']
    } else if (Array.isArray(types)) {
      this.billDocumentTypes = types.filter(type => {
        return validEntries.includes(type)
      })
    }
  }

  createVoteResults(voteResults) {
    const validEntries = Object.values(Parameters.VoteParameters.Outcome)
    if (!voteResults || voteResults === 'all' || !Array.isArray(voteResults)) {
      this.voteResults = ['']
    } else if (Array.isArray(voteResults)) {
      this.voteResults = voteResults.filter(result => {
        return validEntries.includes(result)
      })
    }
  }

  createMotionPrefixes(prefixes) {
    const validEntries = Object.values(flatten(Parameters.VoteParameters.Topic))
    if (!prefixes || prefixes === 'all' || !Array.isArray(prefixes)) {
      this.motionPrefixes = ['']
    } else if (Array.isArray(prefixes)) {
      this.motionPrefixes = prefixes.filter(prefix => {
        return validEntries.includes(prefix)
      })
    }
  }

  createParams(url) {
    this.parliamentSessions.forEach(parl => {
      this.billDocumentTypes.forEach(type => {
        this.voteResults.forEach(result => {
          this.motionPrefixes.forEach(prefix => {
            const params = {}
            if (parl !== '') {
              params.parlSession = parl
            }
            if (type !== '') {
              params.billDocumentTypeId = type
            }
            if (result !== '') {
              params.decisionResultId = result
            }
            if (prefix !== '') {
              params.motionPrefix = prefix
            }
            this.params.push({
              url: url,
              params: params
            })
          })
        })
      })
    })
  }
}

module.exports.VoteScraper = VoteScraper

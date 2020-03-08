require('module-alias/register')
const Components = require('@manager')
const flatten = require('flat')
const Parameters = require('@parameter')

class VoteScraper extends Components.QueueManager {
  static create (params, wait = 5000) {
    const manager = new VoteScraper(params, wait)
    manager
      .setStartAction(new Components.Start.VoteRecord(manager))
      .setStopAction(new Components.Stop.Generic(manager))
      .setAfterAction(new Components.After.Vote(manager))
      .setErrorAction(new Components.Error.Parse(manager))
      .setLogAction(new Components.Log.Typed(VoteScraper))
    return manager
  }

  accumulate (result) {
    if (result) {
      this.result.push(result)
    }
    return result
  }

  constructor (params, wait = 5000) {
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

  async run () {
    await super.run()
    this.finish()
  }

  finish () {
    console.log(`INFO: ${VoteScraper.name}: Data found for ${this.queryCount}/${this.maxQueryCount} queries from passed params`)
  }

  createParliamentSessions (parliamentSessions) {
    const validEntries = Object.values(flatten(Parameters.VoteParameters.Parliament))
    if (!parliamentSessions || parliamentSessions === 'all') {
      this.parliamentSessions = validEntries
    } else if (parliamentSessions instanceof Array) {
      this.parliamentSessions = parliamentSessions.filter(parl => {
        return validEntries.includes(parl)
      })
    }
  }

  createBillDocumentTypes (types) {
    const validEntries = Object.values(flatten(Parameters.VoteParameters.Type))
    if (!types || types === 'all') {
      this.billDocumentTypes = ['']
    } else if (types instanceof Array) {
      this.billDocumentTypes = types.filter(type => {
        return validEntries.includes(type)
      })
    }
  }

  createVoteResults (voteResults) {
    const validEntries = Object.values(Parameters.VoteParameters.Outcome)
    if (!voteResults || voteResults === 'all') {
      this.voteResults = ['']
    } else if (voteResults instanceof Array) {
      this.voteResults = voteResults.filter(result => {
        return validEntries.includes(result)
      })
    }
  }

  createMotionPrefixes (prefixes) {
    const validEntries = Object.values(flatten(Parameters.VoteParameters.Topic))
    if (!prefixes || prefixes === 'all') {
      this.motionPrefixes = ['']
    } else if (prefixes instanceof Array) {
      this.motionPrefixes = prefixes.filter(prefix => {
        return validEntries.includes(prefix)
      })
    }
  }

  createParams (url) {
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

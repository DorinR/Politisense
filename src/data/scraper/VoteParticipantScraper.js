require('module-alias/register')
const Components = require('@manager')
const Parameters = require('@parameter')

class VoteParticipantScraper extends Components.QueueManager {
  static create (params, wait = 5000) {
    const manager = new VoteParticipantScraper(params, wait)
    manager
      .setBeforeAction(new Components.Before.VoteParticipant(manager))
      .setStartAction(new Components.Start.VoteParticipant(manager))
      .setStopAction(new Components.Stop.Generic(manager))
      .setAfterAction(new Components.After.VoteParticipant(manager))
      .setErrorAction(new Components.Error.Parse(manager))
      .setLogAction(new Components.Log.Typed(VoteParticipantScraper))
    return manager
  }

  constructor (params, wait = 5000) {
    super(wait)
    this.parliaments = []
    this.createParliaments(params.parliaments)
    this.sessions = []
    this.createSessions(params.sessions)
    this.params = []
    this.createParams(params.url)
    this.queryCount = this.params.length
    this.maxQueryCount = this.queryCount
  }

  finish () {
    console.log(`INFO: ${VoteParticipantScraper.name}: Data found for ${this.queryCount}/${this.maxQueryCount} queries from passed params`)
  }

  createParliaments (parliaments) {
    if (!parliaments || parliaments === 'all') {
      this.parliaments = Parameters.Parliament.Number
    } else if (Array.isArray(parliaments)) {
      this.parliaments = parliaments
    }
  }

  createSessions (sessions) {
    if (!sessions || sessions === 'all') {
      this.sessions = Parameters.Parliament.Session
    } else if (Array.isArray(sessions)) {
      this.sessions = sessions
    }
  }

  createParams (url) {
    this.parliaments.forEach(parl => {
      this.sessions.forEach(session => {
        this.params.push({
          url: `${url}/${parl}/${session}`,
          params: {
            parliament: parl,
            session: session
          }
        })
      })
    })
  }
}

module.exports = {
  VoteParticipantScraper: VoteParticipantScraper
}

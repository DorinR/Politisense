require('module-alias/register')
const Utils = require('@utils')
const Components = require('@manager')

class VoteParticipantScraper extends Components.QueueManager {
  static create (params, wait = 5000) {
    const manager = new VoteParticipantScraper(params, wait)
    manager
      .setBeforeAction(new Components.Before.VoteParticipant(manager))
      .setStartAction(new Components.Start.VoteParticipant(manager))
      .setStopAction(new Components.Stop.Generic(manager))
      .setAfterAction(new Components.After.VoteParticipant(manager))
      .setErrorAction(new Components.Error.Parse(manager))
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
    this.parliaments = []
    this.createParliaments(params.parliaments)
    this.sessions = []
    this.createSessions(params.sessions)
    this.params = []
    this.createParams(params.url)
    this.queryCount = this.params.length
  }

  createParliaments (parliaments) {
    if (!parliaments || parliaments === 'all') {
      this.parliaments = Parliaments
    } else if (parliaments instanceof Array) {
      this.parliaments = parliaments
    }
  }

  createSessions (sessions) {
    if (!sessions || sessions === 'all') {
      this.sessions = Sessions
    } else if (sessions instanceof Array) {
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

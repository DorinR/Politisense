require('module-alias/register')
const Utils = require('@utils')
const QueueManager = Utils.QueueManager.QueueManager
const StartAction = Utils.QueueManager.Start.StartVoteParticipantScrape
const StopAction = Utils.QueueManager.Stop.GenericStopAction
const Throw = Utils.QueueManager.Error.ParseErrorAction
const BeforeAction = Utils.QueueManager.Before.VoteParticipant
const AfterAction = Utils.QueueManager.After.VoteParticipant

const Parliaments = [36, 37, 38, 39, 40, 41, 42, 43]
Object.freeze(Parliaments)

const Sessions = [1, 2, 3]
Object.freeze(Sessions)

class VoteParticipantScraper extends QueueManager {
  static create (params, wait = 5000) {
    const manager = new VoteParticipantScraper(params, wait)
    manager
      .setBeforeAction(new BeforeAction(manager))
      .setStartAction(new StartAction(manager))
      .setStopAction(new StopAction(manager))
      .setAfterAction(new AfterAction(manager))
      .setErrorAction(new Throw(manager))
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
  }

  createParliaments (parliaments) {
    if(!parliaments || parliaments === 'all') {
      this.parliaments = Parliaments
    } else if (parliaments instanceof Array) {
      this.parliaments = parliaments
    }
  }

  createSessions (sessions) {
    if(!sessions || sessions === 'all') {
      this.sessions = Sessions
    } else if (sessions instanceof Array) {
      this.sessions = sessions
    }
  }

  createParams(url) {
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
const Firestore = require('@firestore').Firestore
const db = new Firestore(false)

VoteParticipantScraper.create({
  url: 'https://www.ourcommons.ca/Members/en/votes',
  parliaments: [41],
})
.execute()
  .then(results => {
    return Promise.all(
      results.map(result =>{
        const parl = result.params.parliament
        const Vote = db.forParliament(parl).Vote()
        if(result.data.length > 0)
        {
          return Promise.all(
            result.data[0].map(vote => {
              return Vote.insert(vote)
            })
          )
        }
        return new Promise(resolve => {resolve(true)})
      })
    )
  })
.then(results => {
  console.log(results)
})
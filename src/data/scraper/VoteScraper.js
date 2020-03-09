require('module-alias/register')
const Utils = require('@utils')
const QueueManager = Utils.QueueManager.QueueManager
const StartAction = Utils.QueueManager.Start.StartVoteRecordScrape
const StopAction = Utils.QueueManager.Stop.GenericStopAction
const Throw = Utils.QueueManager.Error.ParseErrorAction
const AfterAction = Utils.QueueManager.After.VoteAfterAction
const flatten = require('flat')

const Outcome = {
  passed: 15,
  failed: 16,
  tied: 17
}

const Parliament = {
  43: {
    1: 153
  },

  42: {
    1: 152
  },

  41: {
    2: 151,
    1: 150
  },

  40: {
    3: 147,
    2: 145,
    1: 143
  },

  39: {
    1: 142
  },

  38: {
    1: 140
  }
}

const Type = {
  government: {
    house: 3,
    senate: {
      public: 80760,
      private: 80761,
      other: 80759
    }
  },
  private: 4
}

const Topic = {
  budget: {
    policy: 'E',
    appropriations: 'W'
  },
  committee: {
    report: 'K'
  },

  motion: {
    government: 'G',
    routine: 'R',
    opposition: 'O',
    private: 'M'
  },

  statutory: 'L',
  other: 'X'
}
Object.freeze(Outcome)
Object.freeze(Topic)
Object.freeze(Type)
Object.freeze(Parliament)

class VoteScraper extends QueueManager {
  static create(params, wait = 5000) {
    const manager = new VoteScraper(params, wait)
    manager
      .setStartAction(new StartAction(manager))
      .setStopAction(new StopAction(manager))
      .setAfterAction(new AfterAction(manager))
      .setErrorAction(new Throw(manager))
    return manager
  }

  accumulate(result) {
    if (result) {
      this.result.push(result)
    }
    return result
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
  }

  createParliamentSessions(parliamentSessions) {
    const validEntries = Object.values(flatten(Parliament))
    if (!parliamentSessions || parliamentSessions === 'all') {
      this.parliamentSessions = validEntries
    } else if (parliamentSessions instanceof Array) {
      this.parliamentSessions = parliamentSessions.filter(parl => {
        return validEntries.includes(parl)
      })
    }
  }

  createBillDocumentTypes(types) {
    const validEntries = Object.values(flatten(Type))
    if (!types || types === 'all') {
      this.billDocumentTypes = ['']
    } else if (types instanceof Array) {
      this.billDocumentTypes = types.filter(type => {
        return validEntries.includes(type)
      })
    }
  }

  createVoteResults(voteResults) {
    const validEntries = Object.values(Outcome)
    if (!voteResults || voteResults === 'all') {
      this.voteResults = ['']
    } else if (voteResults instanceof Array) {
      this.voteResults = voteResults.filter(result => {
        return validEntries.includes(result)
      })
    }
  }

  createMotionPrefixes(prefixes) {
    const validEntries = Object.values(flatten(Type))
    if (!prefixes || prefixes === 'all') {
      this.motionPrefixes = ['']
    } else if (prefixes instanceof Array) {
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

module.exports = {
  VoteScraper: VoteScraper,
  Outcome: Outcome,
  Parliament: Parliament,
  Type: Type,
  Topic: Topic
}

// VoteScraper.create({
//   url: 'https://www.ourcommons.ca/Members/en/votes/xml',
//   params: {
//     parliaments: 'all'
//   }
// })
//   .execute()
//   .then(results => {
//     //console.log(results)
//   })

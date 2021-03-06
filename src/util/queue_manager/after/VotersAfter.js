const Action = require('../QueueAction').QueueAction
const Firestore = require('@firestore').Firestore

const Parliaments = require('@parameter').Parliament.Number

class VoteParticipantAfterAction extends Action {
  constructor (manager) {
    super()
    this.manager = manager
    this.politicians = this.retrievePoliticians(new Firestore(false))
  }

  retrievePoliticians (db) {
    return Parliaments.map(parl => {
      return db.forParliament(parl)
        .Politician()
        .select()
        .then(snapshot => {
          const politicians = []
          snapshot.forEach(doc => {
            politicians.push({
              data: doc.data(),
              id: doc.id
            })
          })
          console.log(`INFO: ${VoteParticipantAfterAction.name}: ${politicians.length} politicians retrieved for parliament ${parl}`)
          return politicians
        })
    })
  }

  async perform () {
    this.replaceMemberName()
  }

  async replaceMemberName () {
    this.politicians = await Promise.all(this.politicians)
    for (const result of this.manager.result) {
      if (result.data.length === 0) {
        continue
      }
      const politicians = this.politicians[Parliaments.indexOf(result.params.parliament)]
      for (const voter of result.data[0]) {
        const politician = VoteParticipantAfterAction.findPolitician(voter.member, politicians)
        if (politician) {
          voter.member = politician.id
        } else {
          console.warn(`WARN: ${VoteParticipantAfterAction.name}:cannot find politician ${voter.member}`)
        }
      }
    }
  }

  static findPolitician (member, politicians) {
    return politicians.find(politician => {
      return politician.data.name === member
    })
  }
}

module.exports = {
  VoteParticipantAfterAction: VoteParticipantAfterAction
}

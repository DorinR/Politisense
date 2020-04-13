const Action = require('../QueueAction').QueueAction
const Firestore = require('@firestore').Firestore

const Parliament = require('@parameter').VoteParameters.ParliamentExists
const Parliaments = require('@parameter').Parliament.Number

class VoteParticipantBeforeAction extends Action {
  constructor (manager) {
    super()
    this.manager = manager
    this.voteRecords = this.retrieveVoteRecords(new Firestore(false))
  }

  retrieveVoteRecords (db) {
    return Parliaments.map(parl => {
      return db.forParliament(parl)
        .VoteRecord()
        .select()
        .then(snapshot => {
          const voteRecords = []
          snapshot.forEach(doc => {
            voteRecords.push({
              data: doc.data(),
              id: doc.id
            })
          })
          console.log(`INFO ${VoteParticipantBeforeAction.name}: ${voteRecords.length} vote records found for parliament ${parl}`)
          return voteRecords
        })
        .catch(console.error)
    })
  }

  async perform () {
    return this.modifyManagerParams()
  }

  async modifyManagerParams () {
    this.voteRecords = await Promise.all(this.voteRecords)
    const newParams = []
    for (const param of this.manager.params) {
      if (!VoteParticipantBeforeAction.parliamentExists(param.params.parliament, param.params.session)) {
        continue
      }
      const index = Parliaments.indexOf(Number(param.params.parliament))
      this.voteRecords[index].forEach(record => {
        if (record.data.id) {
          newParams.push({
            url: `${param.url}/${record.data.id}/xml`,
            id: record.id,
            parliament: param.params.parliament
          })
        }
      })
    }
    console.log(`INFO: ${VoteParticipantBeforeAction.name}: Parameter Query set changed to ${this.manager.params.length} from ${newParams.length}`)
    this.manager.params = newParams
    this.manager.queryCount = newParams.length
    this.manager.maxQueryCount = this.manager.queryCount
  }

  static parliamentExists (parliament, session) {
    try {
      return Boolean(Parliament[`${parliament}`][`${session}`])
    } catch (e) {
      return false
    }
  }
}

module.exports = {
  VoteParticipantBeforeAction: VoteParticipantBeforeAction
}

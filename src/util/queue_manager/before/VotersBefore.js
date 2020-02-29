const Action = require('../QueueAction').QueueAction
const Firestore = require('@firestore').Firestore

const Parliament = {
  43: {
    1: true
  },

  42: {
    1: true
  },

  41: {
    2: true,
    1: true
  },

  40: {
    3: true,
    2: true,
    1: true
  },

  39: {
    1: true
  },

  38: {
    1: true
  }
}
Object.freeze(Parliament)

const Parliaments = [36, 37, 38, 39, 40, 41, 42, 43]
Object.freeze(Parliaments)

class VoteParticipantBeforeAction extends Action {
  constructor (manager) {
    super()
    this.manager = manager
    this.voteRecords = this.retrieveVoteRecords()
  }

  retrieveVoteRecords () {
    const db = new Firestore(false)
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
          console.log(`INFO: ${voteRecords.length} vote records found for parliament ${parl}`)
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
    for(let param of this.manager.params) {
      if ( !this.parliamentExists(param.params.parliament, param.params.session)) {
        continue
      }
      const index = Parliaments.indexOf(Number(param.params.parliament))
      this.voteRecords[index].forEach(record => {
        if(record.data.id) {
          newParams.push({
            url: `${param.url}/${record.data.id}/xml`,
            id: record.id,
            parliament: param.params.parliament
          })
        }
      })
    }
    this.manager.params = newParams
    this.manager.queryCount = newParams.length
  }

  parliamentExists (parliament, session) {
    try {
      return Boolean(Parliament[`${parliament}`][`${session}`] )
    } catch (e) {
      return false
    }
  }
}

module.exports = {
  VoteParticipantBeforeAction: VoteParticipantBeforeAction
}
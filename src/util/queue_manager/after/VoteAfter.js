const Action = require('../QueueAction').QueueAction
const Firestore = require('@firestore').Firestore

const Parliaments = [36, 37, 38, 39, 40, 41, 42, 43]
Object.freeze(Parliaments)

const ParliamentfromParlSession = {
  153: 43,
  152: 42,
  151: 41,
  150: 41,
  147: 40,
  145: 40,
  143: 40,
  142: 39,
  140: 38
}

class VoteAfterAction extends Action {
  constructor (manager) {
    super()
    this.manager = manager
    this.bills = this.retrieveBills()
  }

  retrieveBills () {
    const db = new Firestore(false)
    return Parliaments.map(parl => {
      return db.forParliament(parl)
        .Bill()
        .select()
        .then(snapshot => {
          const docs = []
          snapshot.forEach(doc => {
            docs.push({
              data: doc.data(),
              id: doc.id
            })
          })
          console.log(`INFO: returning stored bills for parliament: ${parl}`)
          return docs
        })
        .catch(console.error)
    })
  }

  async perform () {
    this.bills = await Promise.all(this.bills)
    this.manager.result.forEach(result => {
      const parliament = ParliamentfromParlSession[result.params.params.parlSession]
      for(let vote of result.data){
        if (vote.billNumber === '' || parliament < 38) {
          continue
        }
        const bills = this.bills[Parliaments.indexOf(parliament)]
        const bill = this.findBill(vote, bills)
        if(bill){
          vote.bill = bill.id
        }
        console.log(vote)
      }
    })
  }

  findBill(vote, bills) {
    return bills.find(bill => {
      return bill.data.number === vote.billNumber && (bill.data.dateVoted.includes(vote.year) || bill.data.dateVoted.includes(vote.year - 1))
    })
  }


}

module.exports = {
  VoteAfterAction: VoteAfterAction
}
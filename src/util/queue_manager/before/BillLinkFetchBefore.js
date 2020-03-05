const QueueAction = require('../QueueAction').QueueAction
const Firestore = require('@firestore').Firestore

const Parliaments = [36, 37, 38, 39, 40, 41, 42, 43]
Object.freeze(Parliaments)

class BillLinkFetchBeforeAction extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
    this.bills = this.retrieveBills(new Firestore(false))
  }

  retrieveBills (db) {
    return Parliaments.map(parl => {
      db.forParliament(parl)
        .Bill()
        .select()
        .then(snapshot => {
          const bills = []
          snapshot.forEach(doc => {
            bills.push({
              data: doc.data(),
              id: doc.id
            })
          })
          return bills
        })
        .then(bills => {
          return bills.filter(bill => {
            return bill.data.link && bill.data.link !== ''
          })
        })
        .catch(console.error)
    })
  }

  async perform () {
    await this.createQueryParams()
  }

  async createQueryParams () {
    this.bills = await Promise.all(this.bills)
    const params = []
    this.manager.params.forEach(param => {
      const parliament = this.bills[Parliaments.indexOf(param.parliament)]
      if (parliament) {
        parliament.forEach(bill => {
          params.push({
            bill: bill.id,
            url: bill.data.link,
            parliament: param.parliament
          })
        })
      }
    })
    this.manager.params = params
    this.manager.queryCount = params.length
  }
}

module.exports = {
  BillLinkFetchBeforeAction: BillLinkFetchBeforeAction
}

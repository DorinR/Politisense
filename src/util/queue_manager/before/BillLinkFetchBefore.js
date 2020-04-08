const QueueAction = require('../QueueAction').QueueAction
const Firestore = require('@firestore').Firestore

const Parliaments = require('@parameter').Parliament.Number

class BillLinkFetchBeforeAction extends QueueAction {
  constructor (manager) {
    super()
    this.manager = manager
    this.bills = this.retrieveBills(new Firestore())
  }

  retrieveBills (db) {
    return Parliaments.map(parl => {
      return db.forParliament(parl)
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
          console.debug(`INFO: ${BillLinkFetchBeforeAction.name}: retrieved ${bills.length} bills.`)
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
    console.log(`INFO: ${BillLinkFetchBeforeAction.name}: Parameter Query set changed to ${this.manager.params.length} from ${params.length}`)
    this.manager.params = params
    this.manager.queryCount = params.length
    this.manager.maxQueryCount = params.length
  }
}

module.exports = {
  BillLinkFetchBeforeAction: BillLinkFetchBeforeAction
}

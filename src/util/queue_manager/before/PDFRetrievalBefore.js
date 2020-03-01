const QueueActions = require('../actions')
const QueueAction = QueueActions.QueueAction
const Firestore = require('@firestore').Firestore

const Parliaments = [36,37,38,39,40,41,42,43]
Object.freeze(Parliaments)

class PDFRetrievalBeforeAction extends QueueAction {
  constructor (manager){
    super()
    this.manager = manager
    this.bills = this.retrieveBills()
  }

  retrieveBills () {
    return Promise.all(
      Parliaments.map(parl => {
      return new Firestore(false)
        .forParliament(parl)
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
    )
  }

  async perform() {
    await this.createQueryParams()
  }

  async createQueryParams () {
    this.bills = await Promise.resolve(this.bills)
    let params = []
    this.manager.params.forEach(param => {
      this.bills.forEach(parliament => {
        parliament.forEach(bill => {
          params.push({
            bill: bill.id,
            url: bill.data.link,
            parliament: param.parliament
          })
        })
      })
    })
    this.manager.params = params
    this.manager.queryCount = params.length
  }
}

module.exports = {
  PDFRetrievalBeforeAction: PDFRetrievalBeforeAction
}
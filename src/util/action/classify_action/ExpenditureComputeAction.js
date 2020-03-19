require('module-alias/register')
const Action = require('../JobAction').AbstractJobAction
const Firestore = require('@firestore').Firestore
const FinancialRecord = require('@model').FinancialRecord

class ExpenditureComputeAction extends Action {
  constructor (params = {}){
    super()
    this.parliament = params.parliament || 43
    this.year = params.year || 2019
    const db = new Firestore().forParliament(this.parliament).atYear(this.year)
    this.records = ExpenditureComputeAction.retrieveFinancialRecords(db)
  }

  static retrieveFinancialRecords(db) {
    return db.FinancialRecord()
      .select()
      .then(snapshot => {
        const docs = []
        snapshot.forEach(doc => {
          docs.push({
            id: doc.id,
            data: doc.data()
          })
        })
        return docs
      })
      .then(docs => {
        return docs.filter(doc => {return Object.keys(doc).length !== 0})
      })
  }

  async perform () {
    return this.computeAverages()
  }

  async computeAverages () {
    this.records = await Promise.resolve(this.records)
    let averages = {}
      this.records.forEach(record => {
       ExpenditureComputeAction.addAmountTo(averages, record.data)
      })
    return Object.keys(averages)
      .map(category => {
        const json = {
          category: category,
          amount: averages[category].amount / averages[category].count,
          parent: averages[category].parent,
          member: 'average',
          year: this.year,
          quarter: 0
      }
      return FinancialRecord.deserialise(json)
    })
      .filter(average => {
        return !(average.parent === '' && average.category === '')
      })
      .sort((a,b) => {
      if(a.parent < b.parent) return -1
      if(a.parent > b.parent) return 1
      if(a.category < b.category) return -1
      if(a.category > b.category) return 1
      return 0
    })
  }

  static addAmountTo(averages, record) {
    const category = record.category
    const parent = record.parent
    ExpenditureComputeAction.AddTo(averages,record,category, parent)
    ExpenditureComputeAction.AddTo(averages,record,parent, '')
  }

  static AddTo(averages, record, category, parent) {
    if(averages[category]){
      averages[category].amount += record.amount
      averages[category].count++
    } else {
      averages[category] = {
        amount: record.amount,
        count: 1,
        parent: parent
      }
    }
  }
}

module.exports = {
  ExpenditureComputeAction: ExpenditureComputeAction
}

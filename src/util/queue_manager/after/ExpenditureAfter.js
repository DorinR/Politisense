const Action = require('../QueueAction').QueueAction
const Firestore = require('@firestore').Firestore

const ExpenditureIdToParliament = {
  'MER2013FY':40,
  'MER2014FY':41,
  'MER2015FY':41,
  'MER2016Q4':42,
  'MER2017Q4B':42,
  'MER2018Q4':42,
  'MER2019Q4':42,
  'MER2020Q1-1019':43,
  'MER2020Q2-1023':43,
}
Object.freeze(ExpenditureIdToParliament)

const Parliaments = [36, 37, 38, 39, 40, 41, 42, 43]
Object.freeze(Parliaments)

class ExpenditureAfterAction extends Action {
  constructor (manager){
    super()
    this.manager = manager
    this.politicians = this.retrievePoliticians(new Firestore())
    this.fallback = false
    this.fallbackRecords = []
    this.fallbackResults = []
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
          console.log(`INFO: ${politicians.length} politicians retrieved for parliament ${parl}`)
          return politicians
        })
    })
  }

  perform () {
    return this.replaceMemberRiding()
  }

  async replaceMemberRiding () {
    this.politicians = await Promise.all(this.politicians)
    for (const result of this.manager.result) {
      if (result.data.length === 0) {
        continue
      }
      const parliament = ExpenditureIdToParliament[result.params.params.Id]
      const politicians = this.politicians[Parliaments.indexOf(parliament)]
      this.firstPassReplacement(result, politicians, parliament)

      if(this.fallback) {
        this.fallback = false
        const parliament = ExpenditureIdToParliament[result.params.params.Id] - 1
        const politicians = this.politicians[Parliaments.indexOf(parliament)]
        this.fallbackReplacement(result, politicians, parliament)
        this.fallbackResults = []
      }
    }
    this.manager.result.push(...this.fallbackResults)
  }

  firstPassReplacement (result, politicians, parliament) {
    let index = 0
    result.params.parliament = parliament
    result.params.year = ExpenditureAfterAction.computeYear(result.params.params.Id)
    while (index < result.data[0].length) {
      let record = result.data[0][index]
      const riding = ExpenditureAfterAction.stripHyphensFromRecord(record)
      const politician = ExpenditureAfterAction.findPolitician(riding, politicians)
      if (politician) {
        record.member = politician.id
        index++
      } else {
        this.fallback = true
        this.fallbackRecords.push(...result.data[0].splice(index,1))
      }
    }
  }

  fallbackReplacement(result, politicians, parliament){
    for (const record of this.fallbackRecords) {
      const riding = ExpenditureAfterAction.stripHyphensFromRecord(record)
      const politician = ExpenditureAfterAction.findPolitician(riding, politicians)
      if (politician) {
        record.member = politician.id
      } else {
        console.warn('WARNING: Financial Record parsed that does not have a parliament,')
      }
    }
    const params = Object.create(result.params)
    params.parliament = parliament
    params.year = ExpenditureAfterAction.computeYear(params.params.Id)
    const records = Array.from(this.fallbackRecords)
    this.fallbackResults.push({
      params: params,
      data: records
    })
  }

  static computeYear (date) {
    return Number(date.substring(3, 7)) - 1
  }

  static stripHyphensFromRecord (record) {
    let riding = record.member
    if (riding.includes('\u2014')) {
      riding = riding.replace(/\u2014/g, '-')
    }
    if (riding.includes('--')) {
      riding = riding.replace(/--/gi, '-')
    }
    return riding.toLowerCase()
  }

  static findPolitician (member, politicians) {
    return politicians.find(politician => {
      return politician.data.riding === member ||
        (politician.data.riding &&
          politician.data.riding
            .split(/[\s-]+/)
            .every(token => {
              return member.includes(token)
            }))
    })
  }
}

module.exports = {
  ExpenditureAfterAction: ExpenditureAfterAction
}
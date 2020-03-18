require('module-alias/register')
const Components = require('@manager')
const Errors = require('../error/errors')
const flatten = require('flat')

const Year = {
  current: {
    //Q1:'MER2020Q1-1019',
    Q2:'MER2020Q2-1023',
  },
  2018:'MER2019Q4',
  2017:'MER2018Q4',
  2016:'MER2017Q4B',
  2015:'MER2016Q4',
  2014:'MER2015FY',
  2013:'MER2014FY',
  2012:'MER2013FY',
}


class ExpenditureScraper extends Components.QueueManager {
  static create(params,wait=5000) {
    const manager = new ExpenditureScraper(params, wait)
    manager
      .setStartAction(new Components.Start.Expenditure(manager))
      .setStopAction(new Components.Stop.GenericStopAction(manager))
      .setAfterAction(new Components.After.Expenditure(manager))
      .setErrorAction(new Components.Error.ParseErrorAction(manager))
    return manager
  }

  constructor (params, wait=5000) {
    super(wait)
    this.years = []
    this.createYears(params.years)

    this.params = []
    this.createQueries(params.url)
    this.queryCount = this.params.length
  }

  createYears(years) {
    const valid = Object.values(flatten(Year))
    if(typeof years === 'undefined' || years === 'all') {
      this.years = valid
    } else if (Array.isArray(years)) {
      this.years = years.filter(year => {
        return valid.includes(year)
      })
    }
  }

  createQueries(url) {
    this.years.forEach(year => {
      this.params.push({
        url: url,
        params: {
          Id: year,
          Language: 'E',
          FormatType: 'XML'
        }
      })
    })
  }

  accumulate (result) {
    if (result) {
      this.result.push(result)
    }
    return result
  }
}

module.exports = {
  ExpenditureScraper: ExpenditureScraper
}

ExpenditureScraper
  .create({
    url:'https://www.ourcommons.ca/PublicDisclosure/MemberExpenditures.aspx',
    years: 'all',
  })
  .execute()
  .then(results => {
    console.log(results)
  })
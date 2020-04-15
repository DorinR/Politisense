require('module-alias/register')
const Components = require('@manager')
const flatten = require('flat')
const Parameters = require('@parameter').ExpenditureParameters

class ExpenditureScraper extends Components.QueueManager {
  static create (params, wait = 5000) {
    const manager = new ExpenditureScraper(params, wait)
    manager
      .setStartAction(new Components.Start.Expenditure(manager))
      .setStopAction(new Components.Stop.Generic(manager))
      .setAfterAction(new Components.After.Expenditure(manager))
      .setErrorAction(new Components.Error.Parse(manager))
    return manager
  }

  constructor (params, wait = 5000) {
    super(wait)
    this.years = []
    this.createYears(params.years)

    this.params = []
    this.createQueries(params.url)
    this.queryCount = this.params.length
  }

  createYears (years) {
    const valid = Object.values(flatten(Parameters.Year))
    if (typeof years === 'undefined' || years === 'all') {
      this.years = valid
    } else if (Array.isArray(years)) {
      this.years = years.filter(year => {
        return valid.includes(year)
      })
    }
  }

  createQueries (url) {
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
}

module.exports = {
  ExpenditureScraper: ExpenditureScraper
}

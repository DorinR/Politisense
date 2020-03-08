require('module-alias/register')
const Components = require('@manager')

class PoliticianScraper extends Components.QueueManager {
  static create (params, wait = 5000) {
    const manager = new PoliticianScraper(params, wait)
    manager
      .setStartAction(new Components.Start.Politician(manager))
      .setStopAction(new Components.Stop.Generic(manager))
      .setAfterAction(new Components.After.Politician(manager))
      .setErrorAction(new Components.Error.Parse(manager))
      .setLogAction(new Components.Log.Typed(PoliticianScraper))
    return manager
  }

  constructor (params, wait = 5000) {
    super(wait)
    this.parliaments = []
    this.setParliaments(params.parliaments)
    this.caucuses = []
    this.setCaucuses(params.caucuses)
    this.provinces = []
    this.setProvinces(params.provinces)
    this.genders = []
    this.setGenders(params.genders)
    this.lastNamePrefixes = []
    this.setLastNamePrefixes(params.lastNamePrefixes)
    this.params = []
    this.createQueries(params.url)
    this.queryCount = this.params.length
    this.maxQueryCount = this.queryCount
  }

  async run () {
    await super.run()
    this.finish()
  }

  accumulate (result) {
    this.result.push(result)
    return result
  }

  finish () {
    console.log(`INFO: ${PoliticianScraper.name}: Data found for ${this.queryCount}/${this.maxQueryCount} queries from passed params`)
  }

  setParliaments (parliaments) {
    if (typeof parliaments === 'undefined' ||
       (typeof parliaments === typeof '' && parliaments.toLowerCase().includes('all'))) {
      this.parliaments.push('all')
    } else if (typeof parliaments === typeof []) {
      this.parliaments = parliaments.filter(parliament => {
        return parliament >= 35
      })
    }
  }

  setCaucuses (caucuses) {
    if (typeof caucuses === 'undefined' ||
       (typeof caucuses === typeof ' ' && caucuses.toLowerCase().includes('all'))) {
      this.caucuses.push('all')
    } else if (typeof caucuses === typeof []) {
      const validPartyKeys = Object.values(caucusMapping)
      this.caucuses = caucuses.filter(caucus => {
        return validPartyKeys.includes(caucus)
      })
    }
  }

  setProvinces (provinces) {
    if (typeof provinces === 'undefined' ||
       (typeof provinces === typeof ' ' && provinces.toLowerCase().includes('all'))) {
      this.provinces.push('all')
    } else if (typeof provinces === typeof []) {
      this.provinces = provinces.filter(province => {
        return provinceKeys.includes(province)
      })
    }
  }

  setGenders (genders) {
    if (typeof genders === 'undefined' ||
       (typeof genders === typeof ' ' && genders.toLowerCase().includes('all'))) {
      this.genders.push('all')
    } else if (typeof genders === typeof []) {
      this.genders = genders.filter(gender => {
        return gender.toLowerCase() === 'm' || gender.toLowerCase() === 'f'
      })
      this.genders = this.genders.map(g => {
        return g.toUpperCase()
      })
    }
  }

  setLastNamePrefixes (lastNamePrefixes) {
    if (typeof lastNamePrefixes === 'undefined' ||
       (typeof lastNamePrefixes === typeof ' ' && lastNamePrefixes.toLowerCase().includes('all'))) {
      this.lastNamePrefixes.push('')
    } else if (typeof lastNamePrefixes === typeof []) {
      this.lastNamePrefixes = lastNamePrefixes.filter(prefix => {
        return prefix.length === 1 && prefix.toLowerCase().match(/[a-z]/i)
      })
      this.lastNamePrefixes = this.lastNamePrefixes.forEach(prefix => {
        return prefix.toUpperCase()
      })
    }
  }

  createQueries (url) {
    this.parliaments.forEach(parliament => {
      this.caucuses.forEach(caucus => {
        this.provinces.forEach(province => {
          this.genders.forEach(gender => {
            this.lastNamePrefixes.forEach(prefix => {
              this.params.push({
                url: url,
                params: {
                  parliament: parliament,
                  caucusId: caucus,
                  province: province,
                  gender: gender,
                  lastname: prefix
                }
              })
            })
          })
        })
      })
    })
  }
}

module.exports.PoliticianScraper = PoliticianScraper

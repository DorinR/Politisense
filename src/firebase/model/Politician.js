const Condition = require('../../util/utils').Condition
const Model = require('./Model').Model

class Politician extends Model {
  constructor (name, party, riding, yearElected, imageUrl) {
    super()
    Condition.parameter(name).isType(String)
    Condition.parameter(party).isType(String)
    Condition.parameter(riding).isType(String)
    Condition.parameter(yearElected).isType(Number)
    Condition.parameter(imageUrl).isType(String)

    this.name = name
    this.party = party
    this.riding = riding
    this.yearElected = yearElected
    this.imageUrl = imageUrl
  }

  static deserialise (json) {
    return Model.deserialise(json, new Politician('', '', '', 0, ''))
  }

  static builder (name) {
    return new PoliticianBuilder(name)
  }
}

class PoliticianBuilder {
  constructor (name) {
    this.name = name
    this.imageUrl = ''
  }

  withParty (party) {
    this.party = party
    return this
  }

  withRiding (riding) {
    this.riding = riding
    return this
  }

  withYearElected (yearElected) {
    this.yearElected = yearElected
    return this
  }

  withImageUrl (imageUrl) {
    this.imageUrl = imageUrl
    return this
  }

  build () {
    return new Politician(
      this.name,
      this.party,
      this.riding,
      this.yearElected,
      this.imageUrl
    )
  }
}

module.exports.Politician = Politician

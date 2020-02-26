const Condition = require('../../util/Condition').Condition
const Model = require('./Model').Model

class Politician extends Model {
  constructor (name, party, riding, start, end, imageUrl) {
    super()
    Condition.parameter(name).isType(String)
    Condition.parameter(party).isType(String)
    Condition.parameter(riding).isType(String)
    Condition.parameter(start).isType(Number)
    Condition.parameter(end).isType(Number)
    Condition.parameter(imageUrl).isType(String)

    this.name = name
    this.party = party
    this.riding = riding
    this.start = start
    this.end = end
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
    this.imageUrl = 'placeholder'
  }

  withParty (party) {
    this.party = party
    return this
  }

  withRiding (riding) {
    this.riding = riding
    return this
  }

  withStartYear (year) {
    this.start = year
    return this
  }

  withEndYear (year) {
    this.end = year
    return this
  }

  withImageUrl (imageUrl) {
    this.imageUrl = imageUrl
    return this
  }

  build () {
    return new Politician(this.name, this.party, this.riding, this.start, this.end, this.imageUrl)
  }
}

module.exports.Politician = Politician

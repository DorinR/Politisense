const Condition = require('./Condition').Condition
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
}

export { Politician }

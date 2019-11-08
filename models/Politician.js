const Condition = require('./Condition').Condition

class Politician {
  constructor (name, party, riding, yearElected, imageUrl) {
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
}

export { Politician }

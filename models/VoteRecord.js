const Condition = require('./Condition').Condition

class VoteRecord {
  constructor (billNumber, id, name, voters, yeas, nays) {
    Condition.parameter(billNumber).isType(String)
    Condition.parameter(id).isType(Number)
    Condition.parameter(yeas).isType(Number)
    Condition.parameter(nays).isType(Number)
    Condition.parameter(name).isType(String)
    Condition.parameter(voters).isType(Object)

    this.billNumber = billNumber
    this.id = id
    this.name = name
    this.voters = voters
    this.yeas = yeas
    this.nays = nays
    this.assent = Boolean(yeas > nays)
  }
}

export { VoteRecord }

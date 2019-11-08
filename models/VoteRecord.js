const Condition = require('./Condition').Condition

class VoteRecord {
  constructor (billNumber, id, name, voters) {
    Condition.parameter(billNumber).isType(String)
    Condition.parameter(id).isType(Number)
    Condition.parameter(name).isType(String)
    Condition.parameter(voters).isType(Object)

    this.billNumber = billNumber
    this.id = id
    this.name = name
    this.voters = voters
  }
}

export { VoteRecord }
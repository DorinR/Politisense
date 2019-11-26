const Condition = require('./Condition').Condition
const Model = require('./Model').Model

class VoteRecord extends Model {
  constructor (billNumber, id, name, voters, yeas, nays) {
    super()
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

  static deserialise (json) {
    return Model.deserialise(json, new VoteRecord('', 0, 0, 0, 0, 0))
  }
}

export { VoteRecord }

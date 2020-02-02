const Condition = require('../../util/Condition').Condition
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

  static builder (id) {
    return new VoteRecordBuilder(id)
  }
}

class VoteRecordBuilder {
  constructor (id) {
    this.id = id
    this.voters = {}
  }

  withBillNumber (billNumber) {
    this.billNumber = billNumber
    return this
  }

  withName (name) {
    this.name = name
    return this
  }

  withVoters (voters) {
    this.voters = voters
    return this
  }

  withYeas (yeas) {
    this.yeas = yeas
    return this
  }

  withNays (nays) {
    this.nays = nays
    return this
  }

  build () {
    return new VoteRecord(this.billNumber, this.id, this.name, this.voters, this.yeas, this.nays)
  }
}

module.exports.VoteRecord = VoteRecord

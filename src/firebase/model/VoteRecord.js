const Condition = require('../../util/Condition').Condition
const Model = require('./Model').Model

class VoteRecord extends Model {
  constructor (type, year, month, billNumber, id, name, yeas, nays) {
    super()
    Condition.parameter(billNumber).isType(String)
    Condition.parameter(id).isType(Number)
    Condition.parameter(yeas).isType(Number)
    Condition.parameter(nays).isType(Number)
    Condition.parameter(name).isType(String)
    Condition.parameter(type).isType(String)
    Condition.parameter(year).isType(Number)
    Condition.parameter(month).isType(Number)

    this.billNumber = billNumber
    this.bill = '' // cannot be known when first creating this type of record
    this.id = id
    this.name = name
    this.yeas = yeas
    this.nays = nays
    this.type = type
    this.year = year
    this.month = month
  }

  static deserialise (json) {
    return Model.deserialise(json, new VoteRecord('', 0, 0, '', 0, 0, 0, 0))
  }
}

module.exports.VoteRecord = VoteRecord

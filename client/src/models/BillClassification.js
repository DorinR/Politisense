const Condition = require('./Condition').Condition
const Model = require('./Model').Model

class BillClassification extends Model {
  constructor (billId, rawId, classification) {
    super()
    Condition.parameter(billId).isType(String)
    Condition.parameter(rawId).isType(String)
    Condition.parameter(classification).isType(String)

    this.bill = billId
    this.category = classification
  }
}

class TfIdfClassification extends Model {
  constructor (billId, rawTfIdf) {
    super()
    Condition.parameter(billId).isType(String)
    Condition.parameter(rawTfIdf).isType(Object)

    this.bill = billId
    this.raw = rawTfIdf
  }
}

export { BillClassification }
export { TfIdfClassification }
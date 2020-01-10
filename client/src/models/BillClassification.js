const Condition = require('./Condition').Condition
const Model = require('./Model').Model

class BillClassification extends Model {
  constructor (billId, rawId, classification) {
    super()
    Condition.parameter(billId).isType(String)
    Condition.parameter(rawId).isType(String)
    Condition.parameter(classification).isType(String)

    this.bill = billId
    this.raw = rawId
    this.category = classification
  }

  static deserialise (json) {
    return Model.deserialise(json, new BillClassification('', '', ''))
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

  static deserialise (json) {
    return Model.deserialise(json, new TfIdfClassification('', {}))
  }
}

export { BillClassification }
export { TfIdfClassification }

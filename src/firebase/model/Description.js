const Model = require('./Model').Model
const Condition = require('../../util/Condition').Condition

class Description extends Model {
  constructor (identifier, description) {
    super()
    Condition.parameter(identifier).isType(String)
    Condition.parameter(description).isType(String)

    this.identifier = identifier
    this.description = description
  }

  static deserialise (json) {
    return Model.deserialise(json, new Description('', ''))
  }
}

module.exports = {
  Description: Description
}
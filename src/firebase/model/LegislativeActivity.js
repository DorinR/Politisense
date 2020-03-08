const Model = require('./Model').Model
const Condition = require('../../util/Condition').Condition

class LegislativeActivity extends Model {
  constructor (number, title, link, description, date) {
    super()
    Condition.parameter(number).isType(String)
    Condition.parameter(title).isType(String)
    Condition.parameter(link).isType(String)
    Condition.parameter(description).isType(String)
    Condition.parameter(date).isType(String)

    this.number = number
    this.title = title
    this.link = link
    this.description = description
    this.date = date
  }

  static deserialise(json) {
    return Model.deserialise(json, new LegislativeActivity('','','','',''))
  }
}

module.exports = {
  LegislativeActivity: LegislativeActivity
}
const Model = require('./Model').Model
const Condition = require('../../util/Condition').Condition

class LegislativeActivity extends Model {
  constructor (number, title, link, description, date, yes = 0, no = 0) {
    super()
    Condition.parameter(number).isType(String)
    Condition.parameter(title).isType(String)
    Condition.parameter(link).isType(String)
    Condition.parameter(description).isType(String)
    Condition.parameter(date).isType(String)
    Condition.parameter(yes).isType(Number)
    Condition.parameter(no).isType(Number)

    this.number = number
    this.title = title
    this.link = link
    this.description = description
    this.date = date
    this.yes = yes
    this.no = no
  }

  static deserialise (json) {
    return Model.deserialise(json, new LegislativeActivity('', '', '', '', '', 0, 0))
  }
}

module.exports = {
  LegislativeActivity: LegislativeActivity
}

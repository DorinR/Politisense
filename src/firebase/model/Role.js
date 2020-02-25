const Model = require('./Model').Model
const parameter = require('../../util/Condition').Condition.parameter

class Role extends Model {
  constructor (type, title, group, from, to, politician) {
    super()
    parameter(title).isType(String)
    parameter(type).isType(String)
    parameter(group).isType(String)
    parameter(from).isType(Number)
    parameter(to).isType(Number)
    parameter(politician).isType(String)

    this.group = group
    this.title = title
    this.fromDate = from
    this.toDate = to
    this.politician = politician
    this.type = type
  }

  static deserialise (json) {
    Model.deserialise(json, new Role('', '', '', -1, -1, ''))
  }
}

module.exports = {
  Role: Role
}

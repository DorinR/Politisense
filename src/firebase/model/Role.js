const Model = require('./Model').Model
const Condition = require('../../util/Condition').Condition.parameter
const Builder = require('./builder/builders').RoleBuilder

class Role extends Model {
  constructor (type, title, from, to, politician) {
    super()
    parameter(title).isType(String)
    parameter(type).isType(String)
    parameter(from).isType(Number)
    parameter(to).isType(Number)
    parameter(politician).isType(string)

    this.title = title
    this.fromDate = from
    this.toDate = to
    this.politician = politician
  }

  static deserialise(json) {
    Model.deserialise(json, new Role('', -1, -1, ''))
  }

  static builder (id) {
    return new Builder(id)
  }
}

module.exports = {
  Role : Role
}
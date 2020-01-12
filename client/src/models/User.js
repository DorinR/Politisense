const Condition = require('./Condition').Condition
const Model = require('./Model').Model

class User extends Model {
  constructor (email, firstname, lastname, password, postalCode, riding, categories) {
    super()
    Condition.parameter(email).isType(String)
    Condition.parameter(firstname).isType(String)
    Condition.parameter(lastname).isType(String)
    Condition.parameter(password).isType(String)
    Condition.parameter(postalCode).isType(String)
    Condition.parameter(riding).isType(String)
    Condition.parameter(categories).isType(Object)

    this.email = email
    this.firstname = firstname
    this.lastname = lastname
    this.password = password
    this.postalCode = postalCode
    this.riding = riding
    this.categories = categories
  }

  static deserialise (json) {
    return Model.deserialise(json, new User('', '', '', '', '', '', {}))
  }
}

module.exports.User = User

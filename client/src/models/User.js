const Condition = require('./Condition').Condition
const Model = require('./Model').Model

class User extends Model {
  constructor (email, firstname, lastname, password, postalCode, riding, categories, isAdmin = false) {
    super()
    Condition.parameter(email).isType(String)
    Condition.parameter(firstname).isType(String)
    Condition.parameter(lastname).isType(String)
    Condition.parameter(password).isType(String)
    Condition.parameter(postalCode).isType(String)
    Condition.parameter(riding).isType(String)
    Condition.parameter(categories).isType(Object)
    Condition.parameter(isAdmin).isType(Boolean)

    this.email = email
    this.firstname = firstname
    this.lastname = lastname
    this.password = password
    this.postalCode = postalCode
    this.riding = riding
    this.categories = categories
    this.isAdmin = isAdmin
  }

  static deserialise (json) {
    return Model.deserialise(json, new User('', '', '', '', '', '', {}, false))
  }
}

export { User }

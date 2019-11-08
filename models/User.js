const Condition = require('./Condition').Condition

class User {
  constructor (email, firstname, lastname, password, postalCode, riding, categories) {
    Condition.parameter(email).isType(String)
    Condition.parameter(firstname).isType(String)
    Condition.parameter(lastname).isType(String)
    Condition.parameter(password).isType(String)
    Condition.parameter(postalCode).isType(String)
    Condition.parameter(riding).isType(String)
    Condition.parameter(categories).isType(String)

    this.email = email
    this.firstname = firstname
    this.lastname = lastname
    this.password = password
    this.postalCode = postalCode
    this.riding = riding
    this.categories = categories
  }
}

export { User }

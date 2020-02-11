const Role = require('../Role').Role

class RoleBuilder {
  constructor(id) {
    this.politician = id
  }

  withFromYear(year) {
    this.from = year
    return this
  }

  withToYear(year) {
    this.to = year
    return this
  }

  withTitle(title) {
    this.title = title
    return this
  }

  withType(type) {
    this.type = type
    return this
  }

  build(){
    return new Role(this.type, this.title, this.from, this.to, this.politician)
  }
}

module.exports = {
  RoleBuilder: RoleBuilder
}
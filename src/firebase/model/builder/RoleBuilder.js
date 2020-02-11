const Role = require('../Role').Role

class RoleBuilder {
  constructor(id = 'placeholder') {
    this.politician = id
    this.from = 0
    this.to = 0
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

  withGroup(group) {
    this.group = group
    return this
  }

  build(){
    return new Role(this.type, this.title, this.group, this.from, this.to, this.politician)
  }
}

module.exports = {
  RoleBuilder: RoleBuilder
}
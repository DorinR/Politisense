
class ModelError extends TypeError {
  constructor (param, type) {
    super('Condition violated in model: Type of ' + param + ' is not ' + typeof type({}))
  }
}

class Condition {
  constructor (param) {
    this.param = param
  }

  static parameter (param) {
    return new Condition(param)
  }

  isType (type) {
    if (typeof this.param !== typeof type({})) {
      throw new ModelError(this.param, type)
    }
  }
}

module.exports.Condition = Condition

class ModelError extends TypeError {
  constructor (params) {
    super()
    if (params.type) {
      this.message = `Condition violated in model: Type of ${params.param} is not ${typeof params.type({})}`
    } else if (params.value && params.condition) {
      this.message = `Condition violated in model: Passed value: ${params.param}, expected (passed value) ${params.condition} ${params.value}`
    } else {
      this.message = `Condition violated in model for attribute ${params.param}`
    }
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
      throw new ModelError({
        param: this.param,
        type: type
      })
    }
    return this
  }

  isValue (value) {
    if (this.param !== value) {
      throw new ModelError({
        param: this.param,
        value: value,
        condition: '!='
      })
    }
    return this
  }

  isMoreThan (value) {
    if (typeof this.param !== typeof Number(0) || typeof value !== typeof Number(0)) {
      throw new TypeError('Cannot use function on non numeric Parameters')
    }
    if (this.param <= value) {
      throw new ModelError({
        param: this.param,
        value: value,
        condition: '>'
      })
    }
    return this
  }

  isMoreThanOrEqual (value) {
    if (typeof this.param !== typeof Number(0) || typeof value !== typeof Number(0)) {
      throw new TypeError('Cannot use function on non numeric Parameters')
    }
    if (this.param < value) {
      throw new ModelError({
        param: this.param,
        value: value,
        condition: '>='
      })
    }
    return this
  }

  isLessThan (value) {
    if (typeof this.param !== typeof Number(0) || typeof value !== typeof Number(0)) {
      throw new TypeError('Cannot use function on non numeric Parameters')
    }
    if (this.param >= value) {
      throw new ModelError({
        param: this.param,
        value: value,
        condition: '<'
      })
    }
    return this
  }

  isLessThanOrEqual (value) {
    if (typeof this.param !== typeof Number(0) || typeof value !== typeof Number(0)) {
      throw new TypeError('Cannot use function on non numeric Parameters')
    }
    if (this.param > value) {
      throw new ModelError({
        param: this.param,
        value: value,
        condition: '<='
      })
    }
    return this
  }

  contains (value) {
    if (typeof this.param !== typeof String('') || typeof value !== typeof String('')) {
      throw new TypeError('Cannot use function on non string Parameters')
    }
    if (!this.param.includes(value)) {
      throw new ModelError({
        param: this.param,
        value: value,
        condition: 'does not include substring'
      })
    }
    return this
  }
}

module.exports.Condition = Condition

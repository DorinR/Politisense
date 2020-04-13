const Action = require('../QueueAction').QueueAction

class TypedLogAction extends Action {
  constructor (type) {
    super()
    this.type = type.name
  }

  perform (result) {
    let message
    if (result instanceof Object && !(result instanceof Array)) {
      message = `INFO: ${this.type}: job finished, found ${result.data ? result.data.length : 0} potential results`
    } else if (result instanceof Array) {
      message = `INFO: ${this.type}: job finished, found ${result ? result.length : 0} potential results`
    } else if (result) {
      message = `INFO: ${this.type}: job finished with value: ${result}`
    } else {
      console.debug(`WARN: ${this.type}: undefined or null result received`)
    }
    if (message) {
      console.log(message)
    }
    return result
  }
}

module.exports = {
  TypedLogAction: TypedLogAction
}

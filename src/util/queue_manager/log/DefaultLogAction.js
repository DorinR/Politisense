const Action = require('../QueueAction').QueueAction

class DefaultLogAction extends Action {
  perform (result) {
      let message
      if (result instanceof Object) {
        message = `INFO: job finished, found ${result.data ? result.data.length : 0} potential results`
      } else if (result) {
        message = `INFO: job finished, found ${result ? result.length : 0} potential results`
      } else {
        message = 'WARN: undefined or null result received'
      }
      if (message) {
        console.log(message)
      }
      return result
  }
}

module.exports = {
  DefaultLogAction: DefaultLogAction
}
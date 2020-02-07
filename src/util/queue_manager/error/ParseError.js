const Action = require('@manager').QueueAction
const XMLParseError = require('../../parser/parsers').DataNotFoundError

class ParseErrorAction extends Action {
  constructor (manager) {
    super()
    this.manager = manager
  }

  perform (e) {
    this.manager.queryCount--
    if (!(e instanceof XMLParseError)) {
      throw e
    }
  }
}

module.exports.ParseErrorAction = ParseErrorAction

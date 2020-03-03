const Action = require('../QueueAction').QueueAction
const XMLParseError = require('../../parser/parsers').DataNotFoundError

class ParseErrorAction extends Action {
  constructor (manager) {
    super()
    this.manager = manager
  }

  async perform (e) {
    await this.manager.lock.acquire()
    this.manager.queryCount--
    this.manager.lock.release()
    if (!(e instanceof XMLParseError)) {
      throw e
    }
  }
}

module.exports.ParseErrorAction = ParseErrorAction

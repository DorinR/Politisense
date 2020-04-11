const GenericErrorAction = require('./GenericError').GenericErrorAction
const XMLParseError = require('../../parser/parsers').DataNotFoundError

class ParseErrorAction extends GenericErrorAction {
  constructor (manager) {
    super(manager, XMLParseError)
  }
}

module.exports.ParseErrorAction = ParseErrorAction

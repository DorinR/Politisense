const Action = require('./GenericError').GenericErrorAction
const ScrapeError = require('../../action/error/errors').ScrapeError

class ScrapeErrorAction extends Action {
  constructor (manager) {
    super(manager, ScrapeError)
  }
}

module.exports.ScrapeErrorAction = ScrapeErrorAction

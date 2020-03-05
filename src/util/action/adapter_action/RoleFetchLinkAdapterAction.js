const Action = require('../JobAction').AbstractJobAction
const RequestError = require('../error/errors').RequestError

class RoleFetchLinkAdapterAction extends Action {
  constructor (params) {
    super()
    this.params = params
  }

  async perform (result) {
    if (!result) {
      throw new RequestError(this.params)
    }
    const nameWithInaccessibleID = result
    const url = `https://www.ourcommons.ca${nameWithInaccessibleID}/roles/xml`
    return {
      url: url
    }
  }
}

module.exports.RoleFetchLinkAdapterAction = RoleFetchLinkAdapterAction


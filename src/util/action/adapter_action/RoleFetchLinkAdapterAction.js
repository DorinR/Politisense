const Action = require('../JobAction').AbstractJobAction

class RoleFetchLinkAdapterAction extends Action {
  constructor (params) {
    super()
    this.params = params
  }

  async perform (result) {
    if (!result) {
      throw new Actions.Errors.RequestError(this.params)
    }
    const nameWithInaccessibleID = result
    const url = ` https://www.ourcommons.ca${nameWithInaccessibleID}/roles/xml`
    return {
      url: url
    }
  }
}

module.exports.RoleFetchLinkAdapterAction = RoleFetchLinkAdapterAction


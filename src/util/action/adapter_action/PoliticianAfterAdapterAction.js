const Action = require('../JobAction').AbstractJobAction

class PoliticianAfterAdapterAction extends Action {
  constructor(prefixLink = 'https://www.ourcommons.ca') {
    super()
    this.prefix = prefixLink
  }
  perform (response) {
    // eslint-disable-next-line no-unused-vars
    const { selected, other } = response
    return selected.map(url => {
      return this.prefix + url
    })
  }
}

module.exports = {
  PoliticianAfterAdapterAction: PoliticianAfterAdapterAction
}
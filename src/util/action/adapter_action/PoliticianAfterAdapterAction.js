const Action = require('../JobAction').AbstractJobAction

class PoliticianAfterAdapterAction extends Action {
  perform (response) {
    // eslint-disable-next-line no-unused-vars
    const { selected, other } = response
    return selected.map(url => {
      return 'https://www.ourcommons.ca' + url
    })
  }
}

module.exports = {
  PoliticianAfterAdapterAction: PoliticianAfterAdapterAction
}
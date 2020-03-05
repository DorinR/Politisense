const Action = require('../JobAction').AbstractJobAction

class BillLinkFetchAdapterAction extends Action {
  constructor (params) {
    super()
    this.params = params
  }

  async perform (links) {
    console.log(`INFO: Retrieved Bill link: ${links.selected[0]}`)
    return {
      url: links.selected[0],
      id: this.params.bill,
      parliament: this.params.parliament
    }
  }
}

module.exports.BillLinkFetchAdapterAction = BillLinkFetchAdapterAction
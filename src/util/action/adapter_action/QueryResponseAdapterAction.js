const Action = require('../JobAction').AbstractJobAction
class QueryResponseAdapterAction extends Action {
  constructor (params) {
    super()
    this.params = params
  }

  async perform (result) {
    return {
      params: this.params,
      data: result
    }
  }
}

module.exports.QueryResponseAdapterAction = QueryResponseAdapterAction

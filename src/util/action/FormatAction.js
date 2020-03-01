const Action = require('./JobAction').AbstractJobAction
class FormatAction extends Action {
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

module.exports.FormatAction = FormatAction
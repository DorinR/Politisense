const Action = require('../JobAction').AbstractJobAction
const Parliaments = require('@parameter').Parliament.Number
const TfIdfClassification = require('@model').TfIdfClassification

class ClassificationResultAdapterAction extends Action {
  constructor (params) {
    super()
    this.params = params
  }

  async perform(results) {
    return Parliaments.map(parliament => {
      const data = results
        .filter(result => { return result.parliament === parliament && result.raw})
        .map(result => { return new TfIdfClassification(result.bill, result.raw) })
      return {
        params: { parliament: parliament },
        data: data
      }
    })
  }
}

module.exports.ClassificationResultAdapterAction = ClassificationResultAdapterAction
const Action = require('./JobAction').AbstractJobAction

class RequeueAction extends Action {
  constructor (callback, creationFn, topLevelDomains) {
    super()
    this.callback = callback
    this.create = creationFn
    this.tlds = topLevelDomains
  }

  async perform(data) {
    const {other, selected} = data
    const newJobs = []
    other.forEach(link => {
      newJobs.push(this.create(link, this.callback, this.tlds))
    })
    this.callback(newJobs)
    return selected
  }
}

module.exports.RequeueAction = RequeueAction
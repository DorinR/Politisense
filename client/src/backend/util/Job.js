const Utils = require('./utils')
const Action = Utils.Actions.Action
const DecorationError = Utils.Actions.Errors.ActionDecorationError

class Job {
  constructor (url, callback) {
    this.url = url
    this.actions = []
    this.handleErrors = console.error
    this.callback = callback
    this.logAction = console.log
    this.done = false
  }

  addAction (action) {
    if (!(action instanceof Action)) {
      throw new DecorationError(action)
    }

    const fn = action.perform.bind(action)
    this.actions.push(fn)
    return this
  }

  addErrorAction (action) {
    if (!(action instanceof Action)) {
      throw new DecorationError(action)
    }
    this.handleErrors = action.perform.bind(action)
    return this
  }

  addLogAction (action) {
    if (!(action instanceof Action)) {
      throw new DecorationError(action)
    }
    this.logAction = action.perform.bind(action)
    return this
  }

  async execute () {
    return this.actions.reduce((promise, action) => {
      return promise.then(action)
    }, Promise.resolve())
      .catch(e => {
        this.handleErrors(e)
        return null
      })
      .finally(this.logAction)
  }

  static create (url, callback) {
    throw new TypeError('::createNewJob not implemented in derived class')
  }
}

module.exports.AbstractJob = Job

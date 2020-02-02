const Action = require('./job_actions/actions').Action

class DecorationError extends Error {
  constructor (message, action) {
    super()
    if (!message) {
      message = `Tried to add action of type ${action.constructor.name}. It is not of Type Action.`
    }
    this.message = message
  }
}

class Job {
  constructor (url, callback) {
    this.url = url
    this.queueCallback = callback
    this.actions = []
    this.handleErrors = console.error
    this.logAction = console.log
    this.done = false
  }

  addAction (action) {
    if (!(action instanceof Action)) {
      throw new DecorationError()
    }

    const fn = action.perform.bind(action)
    this.actions.push(fn)
    return this
  }

  addErrorAction (action) {
    if (!(action instanceof Action)) {
      throw new DecorationError()
    }
    this.handleErrors = action.perform.bind(action)
    return this
  }

  addLogAction (action) {
    if (!(action instanceof Action)) {
      throw new DecorationError()
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

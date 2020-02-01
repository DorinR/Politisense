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
    if(!(action instanceof Action)) {
      throw new DecorationError()
    }

    const fn = action.perform.bind(action)
    this.actions.push(fn)
    return this
  }

  addErrorAction (action) {
    if(!(action instanceof Action)) {
      throw new DecorationError()
    }
    this.handleErrors = action.perform.bind(action)
    return this
  }

  addLogAction (action) {
    if(!(action instanceof Action)) {
      throw new DecorationError()
    }
    this.logAction = action.perform.bind(action)
    return this
  }

  async execute() {
    return this.actions.reduce((promise, action) => {
      return promise
        .then(action)
        .catch(this.handleErrors)
        .finally(this.logAction)
    }, Promise.resolve())
  }

  createNewJobs (urls) {
    const newJobs = []
    urls.forEach((url) => {
      newJobs.push(Job.create(url, this.queueCallback))
    })
    return newJobs
  }

  static create (url, callback) {
    throw new TypeError('::createNewJob not implemented in derived class')
  }

  static connectionErrorName (message) {
    if (!message) {
      return null
    }

    if (message.includes('ESOCKETTIMEDOUT')) {
      return 'ESOCKETTIMEDOUT'
    }
    if (message.includes('ETIMEDOUT')) {
      return 'ETIMEDOUT'
    }
    if (message.includes('ECONNRESET')) {
      return 'ECONNRESET'
    }
    if (message.includes('EPIPE')) {
      return 'EPIPE'
    }
    if (message.includes('ENOTFOUND')) {
      return 'ENOTFOUND'
    }
    return null
  }
}

module.exports.AbstractJob = Job

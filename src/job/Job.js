const Actions = require('@action')
const Action = Actions.Action
const DecorationError = Actions.Errors.ActionDecorationError

class Job {
  constructor (param, callback) {
    this.param = param
    this.url = param && param.url ? param.url : ''
    this.actions = []
    this.registry = []
    this.handleErrors = console.error
    this.callback = callback
    this.logAction = () => {}
    this.done = false
  }

  addAction (action) {
    Job.check(action)
    const fn = action.perform.bind(action)

    if (action.wrapped) {
      this.registry.push(action.wrapped)
    } else {
      this.registry.push(action.constructor.name)
    }

    this.actions.push(fn)
    return this
  }

  addErrorAction (action) {
    Job.check(action)
    this.handleErrors = action.perform.bind(action)
    return this
  }

  addLogAction (action) {
    Job.check(action)
    this.logAction = action.perform.bind(action)
    return this
  }

  static check (action) {
    if (!(action instanceof Action)) {
      throw new DecorationError(action)
    }
  }

  async execute () {
    return this.actions.reduce((promise, action) => {
      return promise.then(action)
    }, Promise.resolve())
      .catch(async e => {
        const err = await this.handleErrors(e)
        if (err) {
          throw err
        }
      })
      .finally(this.logAction)
  }

  static create (url, callback) {
    throw new TypeError('::createNewJob not implemented in derived class')
  }

  static createRequestParams (params) {
    return {
      url: params.url,
      params: params.params
    }
  }
}

module.exports.AbstractJob = Job

const Job = require('../util/Job').AbstractJob
const Actions = require('@action')
const RoleParser = require('@parser').RoleXmlParser

/*
need to separate this into two actions, since too much can go wrong across multiple downloads
 */

class FormatAction extends Actions.Action {
  constructor (params) {
    super()
    this.params = params
  }

  async perform (result) {
    const {associations, committees, parliamentaries} = result
    const roles = []
    roles.push(...associations)
    roles.push(...committees)
    roles.push(...parliamentaries)
    roles.forEach(role => {
      role.politician = this.params.id
    })
    return {
      params: this.params,
      data: roles
    }
  }
}

class AdapterAction extends Actions.Action {
  constructor (params) {
    super()
    this.params = params
  }

  async perform (result) {
    if(!result) {
      throw new Actions.Errors.RequestError(`ERROR: no name provided`, this.params.url)
    }
    const nameWithInaccessibleID = result
    const url = ` https://www.ourcommons.ca${nameWithInaccessibleID}/roles/xml`
    return {
      url: url
    }
  }
}

class RoleFetchJob extends Job {
  // eslint-disable-next-line no-useless-constructor
  constructor (params, cb) {
    super(params.url, cb)
    this.params = params
  }

  static create (params, cb) {
    const requestParams = RoleFetchJob.createRequestParams(params)
    const job = new RoleFetchJob(params, cb)
    job
      .addAction(new Actions.SelectionGroupAction(params.name, params.group))
      .addAction(new AdapterAction(params))
      .addAction(new Actions.FetchAction(requestParams))
      .addAction(new Actions.ParserWrapperAction(RoleParser, {withRoles: true}))
      .addAction(new FormatAction(params))
      .addErrorAction(new Actions.HandleConnectionErrorAction(cb, RoleFetchJob.create, params))
    job.params = params
    return job
  }

  static createRequestParams (params) {
    return {
      url: params.url,
      params: params.params
    }
  }
}

module.exports.RoleFetchJob = RoleFetchJob

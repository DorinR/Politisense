const Job = require('./Job').AbstractJob
const Actions = require('@action')
const RoleParser = require('@parser').RoleXmlParser

class RoleFetchJob extends Job {
  constructor (params, cb) {
    super(params, cb)
    this.params = params
  }

  static create (params, cb) {
    const requestParams = RoleFetchJob.createRequestParams(params)
    const job = new RoleFetchJob(params, cb)
    job
      .addAction(new Actions.SelectionGroupAction(params.name, params.group))
      .addAction(new Actions.RoleFetchLinkAdapterAction(params))
      .addAction(new Actions.FetchAction(requestParams))
      .addAction(new Actions.ParserWrapperAction(RoleParser, { withRoles: true }))
      .addAction(new Actions.RoleQueryResponseAdapterAction(params))
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

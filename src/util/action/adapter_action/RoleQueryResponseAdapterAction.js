const Action = require('../JobAction').AbstractJobAction

class RoleQueryResponseAdapterAction extends Action {
  constructor (params) {
    super()
    this.params = params
  }

  async perform (result) {
    const { associations, committees, parliamentaries } = result
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

module.exports.RoleQueryResponseAdapterAction = RoleQueryResponseAdapterAction

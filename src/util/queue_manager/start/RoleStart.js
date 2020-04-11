const QueueAction = require('./GenericStartAction').GenericStartAction
const RoleFetchJob = require('../../../job/RoleFetchJob').RoleFetchJob

class RoleStartAction extends QueueAction {
  constructor (manager) {
    super(manager, RoleFetchJob)
  }
}

module.exports = {
  RoleStartAction: RoleStartAction
}

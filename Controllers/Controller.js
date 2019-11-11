const UserController = require('./UserController')
const RepresentativeController = require('./RepresentativeController')
const BillController = require('./BillController')
const VoteRecordController = require('./VoteRecordController')

module.exports = {
  // User
  userSignup: function (req, res) {
    return UserController.userSignup(req, res)
  },
  userLogin: function (req, res) {
    return UserController.userLogin(req, res)
  },
  getUserByEmail: function (req, res) {
    return UserController.getUserByEmail(req, res)
  },

  setRiding: function (req, res) {
    return UserController.setRiding(req, res)
  },
  check: function (req, res) {
    return UserController.check(req, res)
  },
  // Representatives
  getRepresentativeByRiding: function (req, res) {
    return RepresentativeController.getRepresentativeByRiding(req, res)
  },

  // Bills
  getBillById: function (req, res) {
    return BillController.getBillById(req, res)
  },

  // Vote Record
  getVotesByRepresentative: function (req, res) {
    return VoteRecordController.getVotesByRepresentative(req, res)
  }
}

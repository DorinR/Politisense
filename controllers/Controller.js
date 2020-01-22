const UserController = require('./UserController')
const RepresentativeController = require('./RepresentativeController')
const BillController = require('./BillController')
const VoteRecordController = require('./VoteRecordController')

module.exports = {
  userSignup: function(req, res) {
    return UserController.userSignup(req, res)
  },
  userLogin: function(req, res) {
    return UserController.userLogin(req, res)
  },
  getUserByEmail: function(req, res) {
    return UserController.getUserByEmail(req, res)
  },
  updateUser: function(req, res) {
    return UserController.updateUser(req, res)
  },

  setRiding: function(req, res) {
    return UserController.setRiding(req, res)
  },
  updateUserRiding: function(req, res) {
    return UserController.updateUserRiding(req, res)
  },
  checkIfUserExists: function(req, res) {
    return UserController.checkIfUserExists(req, res)
  },

  getRepresentativeByRiding: function(req, res) {
    return RepresentativeController.getRepresentativeByRiding(req, res)
  },
  getAllRepresentatives: function(req, res) {
    return RepresentativeController.getAllRepresentatives(req, res)
  },
  getRepresentativeId: function(req, res) {
    return RepresentativeController.getRepresentativeId(req, res)
  },

  getBillById: function(req, res) {
    return BillController.getBillById(req, res)
  },

  getVotesByRepresentative: function(req, res) {
    return VoteRecordController.getVotesByRepresentative(req, res)
  }
}

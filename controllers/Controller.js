const UserController = require('./UserController')
const RepresentativeController = require('./RepresentativeController')
const BillController = require('./BillController')
const VoteRecordController = require('./VoteRecordController')
const VoteController = require('./VoteController')

module.exports = {
  userSignup: function (req, res) {
    return UserController.userSignup(req, res)
  },
  userLogin: function (req, res) {
    return UserController.userLogin(req, res)
  },
  getUserByEmail: function (req, res) {
    return UserController.getUserByEmail(req, res)
  },
  updateUser: function (req, res) {
    return UserController.updateUser(req, res)
  },
  setRiding: function (req, res) {
    return UserController.setRiding(req, res)
  },
  updateUserRiding: function (req, res) {
    return UserController.updateUserRiding(req, res)
  },
  checkIfUserExists: function (req, res) {
    return UserController.checkIfUserExists(req, res)
  },
  getUserInterests: function (req, res) {
    return UserController.getUserInterests(req, res)
  },

  getRepresentativeByRiding: function (req, res) {
    return RepresentativeController.getRepresentativeByRiding(req, res)
  },
  getAllRepresentatives: function (req, res) {
    return RepresentativeController.getAllRepresentatives(req, res)
  },

  getRepresentativeId: function (req, res) {
    return RepresentativeController.getRepresentativeId(req, res)
  },

  getAllBills: function (req, res) {
    return BillController.getAllBills(req, res)
  },

  getVotesByRepresentative: function (req, res) {
    return VoteRecordController.getVotesByRepresentative(req, res)
  },

  getAllVoteRecords: function (req, res) {
    return VoteRecordController.getAllVoteRecords(req, res)
  },

  updateUserCategory: function (req, res) {
    return UserController.updateUserCategory(req, res)
  },

  getAllVotesByRepresentative: function (req, res) {
    return VoteController.getAllVotesByRepresentative(req, res)
  }
}

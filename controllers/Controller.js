const UserController = require('./UserController')
const RepresentativeController = require('./RepresentativeController')
const BillController = require('./BillController')
const VoteRecordController = require('./VoteRecordController')
const RidingController = require('./RidingController')

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
  updateUserCategory: function (req, res) {
    return UserController.updateUserCategory(req, res)
  },

  // Representative
  getRepresentativeByRiding: function (req, res) {
    return RepresentativeController.getRepresentativeByRiding(req, res)
  },
  getAllRepresentatives: function (req, res) {
    return RepresentativeController.getAllRepresentatives(req, res)
  },
  getRepresentativeId: function (req, res) {
    return RepresentativeController.getRepresentativeId(req, res)
  },

  // Bill
  getBillById: function (req, res) {
    return BillController.getBillById(req, res)
  },

  // Vote Record
  getVotesByRepresentative: function (req, res) {
    return VoteRecordController.getVotesByRepresentative(req, res)
  },

  // Riding
  getRidingCode: function (req, res) {
    return RidingController.getRidingCode(req, res)
  }
}

const UserController = require('./UserController')
const RepresentativeController = require('./RepresentativeController')
const BillController = require('./BillController')
const VoteRecordController = require('./VoteRecordController')
const VoteController = require('./VoteController')
const RidingController = require('./RidingController')
const PartyController = require('./PartyController')
const FinancialRecordController = require('./FinancialRecordController')
const BudgetController = require('./BudgetController')
const MapSupportDataController = require('./MapSupportDataController')
const ActivityVotingController = require('./ActivityVotingController')
const ParliamentController = require('./ParliamentController')
const DataController = require('./DataController')

module.exports = {
  userSignup: function (req, res) {
    return UserController.userSignup(req, res)
  },
  userLogin: function (req, res) {
    return UserController.userLogin(req, res)
  },
  socialLogin: function (req, res) {
    return UserController.socialLogin(req, res)
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
  checkUserVerified: function (req, res) {
    return UserController.checkUserVerified(req, res)
  },
  activateAccount: function (req, res) {
    return UserController.activateAccount(req, res)
  },
  generateActivationLink: function (req, res) {
    return UserController.generateActivationLink(req, res)
  },
  generateResetLink: function (req, res) {
    return UserController.generateResetLink(req, res)
  },
  checkTokenValid: function (req, res) {
    return UserController.checkTokenValid(req, res)
  },
  deleteAccount: function (req, res) {
    return UserController.deleteAccount(req, res)
  },
  getUserInterests: function (req, res) {
    return UserController.getUserInterests(req, res)
  },

  updateUserCategory: function (req, res) {
    return UserController.updateUserCategory(req, res)
  },

  getRepresentativeByRiding: function (req, res) {
    return RepresentativeController.getRepresentativeByRiding(req, res)
  },
  getMpByRiding: function (req, res) {
    return RepresentativeController.getMpByRiding(req, res)
  },
  getPastRepresentativeVotes: function (req, res) {
    return VoteController.getPastRepresentativeVotes(req, res)
  },
  getPastRepresentativePairedVotes: function (req, res) {
    return VoteController.getPastRepresentativePairedVotes(req, res)
  },
  getAllRepresentatives: function (req, res) {
    return RepresentativeController.getAllRepresentatives(req, res)
  },

  getPastRepresentatives: function (req, res) {
    return RepresentativeController.getPastRepresentatives(req, res)
  },

  getRepresentativeId: function (req, res) {
    return RepresentativeController.getRepresentativeId(req, res)
  },

  getPastRepresentativeId: function (req, res) {
    return RepresentativeController.getPastRepresentativeId(req, res)
  },

  getRepresentative: function (req, res) {
    return RepresentativeController.getParliamentData(req, res)
  },

  getCabinetMinisters: function (req, res) {
    return ParliamentController.getCabinetMinisters(req, res)
  },

  getPartyInfo: function (req, res) {
    return ParliamentController.getPartyInfo(req, res)
  },

  getRoleDescription: function (req, res) {
    return ParliamentController.getRoleDescription(req, res)
  },

  getAllBills: function (req, res) {
    return BillController.getAllBills(req, res)
  },

  // Bill
  getBillById: function (req, res) {
    return BillController.getBillById(req, res)
  },
  getNumberOfBillsSponsoredByParty: function (req, res) {
    return BillController.getNumberOfBillsSponsoredByParty(req, res)
  },

  // Bill
  getVotedBillsByMP: function (req, res) {
    return BillController.getVotedBillsByMP(req, res)
  },

  // Vote Record
  getVotesByRepresentative: function (req, res) {
    return VoteRecordController.getVotesByRepresentative(req, res)
  },

  getAllVoteRecords: function (req, res) {
    return VoteRecordController.getAllVoteRecords(req, res)
  },

  getAllBillsByRepForAllParliaments: function (req, res) {
    return BillController.getAllBillsByRepForAllParliaments(req, res)
  },
  getAllBillsBySponsorForAllParliaments: function (req, res) {
    return BillController.getAllBillsBySponsorForAllParliaments(req, res)
  },

  getAllVotesByRepresentative: function (req, res) {
    return VoteController.getAllVotesByRepresentative(req, res)
  },

  getRidingCode: function (req, res) {
    return RidingController.getRidingCode(req, res)
  },

  getAllBillsByHead: function (req, res) {
    return BillController.getAllBillsByHead(req, res)
  },

  getRepresentativesInfo: function (req, res) {
    return RepresentativeController.getRepresentativesInfo(req, res)
  },

  getRidingPopulation: function (req, res) {
    return RidingController.getRidingPopulation(req, res)
  },

  getAllPartyData: function (req, res) {
    return PartyController.getAllPartyData(req, res)
  },

  getAllSpendingItemsForParty: function (req, res) {
    return FinancialRecordController.getAllSpendingItemsForParty(req, res)
  },

  getBudgetData: function (req, res) {
    return BudgetController.budgetData(req, res)
  },

  getImageData: function (req, res) {
    return RepresentativeController.getImageData(req, res)
  },
  getAllRolesByRep: function (req, res) {
    return RepresentativeController.getAllRolesByRep(req, res)
  },

  dataIndex: function (req, res) {
    return DataController.index(req, res)
  },

  update: function (req, res) {
    return DataController.update(req, res)
  },

  getRidingByRidingCode: function (req, res) {
    return RidingController.getRidingByRidingCode(req, res)
  },

  getMapSupportData: function (req, res) {
    return MapSupportDataController.getMapSupportData(req, res)
  },

  index: function (req, res) {
    return ActivityVotingController.index(req, res)
  },

  vote: function (req, res) {
    return ActivityVotingController.vote(req, res)
  },

  fetchCategories: function (req, res) {
    return BillController.fetchCategories(req, res)
  },
  fetchCategoriesFromTxtFiles: function (req, res) {
    return BillController.fetchCategoriesFromTxtFiles(req, res)
  },

  getAllRepsFromAllParliaments: function (req, res) {
    return RepresentativeController.getAllRepsFromAllParliaments(req, res)
  },

  fetchMemberExpenditures: function (req, res) {
    return BudgetController.pastMemberExpenditures(req, res)
  },

  getParliamentNumber: function (req, res) {
    return RepresentativeController.getParliamentNumber(req, res)
  },

  getRepresentativesDateEntryParliament: function (req, res) {
    return RepresentativeController.getRepresentativesDateEntryParliament(
      req,
      res
    )
  },
  representativeVotingHistory: function (req, res) {
    return RepresentativeController.votingHistory(req, res)
  },
  getAllBillsBySponsorName: function (req, res) {
    return BillController.getAllBillsBySponsorName(req, res)
  }
}

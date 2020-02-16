import express from 'express'
const router = express.Router()
const controller = require('../../controllers/Controller')

// @route get api/bills/getAllBills
// @desc get all bills stored on database
// @access Public
router.get('/getAllBills', controller.getAllBills)

/// ${head}/getAllBillsByHead
// @route post api/representatives/:riding/getRepresentative
// @desc  get representative by riding
// @access Public
router.get('/:head/getAllBillsByHead', controller.getAllBillsByHead)

router.get('/:head/getVotedBillsByMP', controller.getVotedBillsByMP)

// @route post api/bills/getAllBillsByRep
// @desc  get bill by bill ID
// @access Public
router.get('/:head/getAllBillsByRep', controller.getAllBillsByRep)

router.get(
  '/:head/getAllBillsBySponsorName',
  controller.getAllBillsBySponsorName
)

// @route get api/bills/getAllBillsSponsoredByParty
// @desc get all the bills that were sponsored by MPs from that party
// @access Public
router.get(
  '/:party/getNumberOfBillsSponsoredByParty',
  controller.getNumberOfBillsSponsoredByParty
)

module.exports = router

import express from 'express'
const router = express.Router()
const controller = require('../../controllers/Controller')

// @route get api/bills/getAllBills
// @desc get all bills stored on database
// @access Public
router.get('/getAllBills', controller.getAllBills)

router.get('/:head/getVotedBillsByMP', controller.getVotedBillsByMP)


// @route post api/bills/getAllBillsByRep
// @desc  get bill by bill ID
// @access Public
router.get('/:head/getAllBillsByRep', controller.getAllBillsByRep)

router.get('/:head/getAllBillsBySponsorName', controller.getAllBillsBySponsorName)

module.exports = router

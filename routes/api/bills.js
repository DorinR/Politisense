import express from 'express'
const router = express.Router()
const controller = require('../../controllers/Controller')

// @route get api/bills/getAllBills
// @desc get all bills stored on database
// @access Public
router.get('/getAllBills', controller.getAllBills)

// @route post api/bills/getBillById
// @desc  get bill by bill ID
// @access Public
router.get('/:head/getVotedBillsByMP', controller.getVotedBillsByMP)

module.exports = router

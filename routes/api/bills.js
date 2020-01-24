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

module.exports = router

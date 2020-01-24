import express from 'express'
const router = express.Router()
const controller = require('../../controllers/Controller')

// @route post api/bills/getBillById
// @desc  get bill by bill ID
// @access Public
router.get('/getBillById', controller.getBillById)

// @route post api/bills/getAllBillsByRep
// @desc  get bill by bill ID
// @access Public
router.get('/:head/getAllBillsByRep', controller.getAllBillsByRep)

router.get('/:head/getAllBillsBySponsorName', controller.getAllBillsBySponsorName)
module.exports = router
